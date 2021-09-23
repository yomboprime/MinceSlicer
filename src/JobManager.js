/*
Mince Slicer

MIT License

Copyright (c) 2021 Juan Jose Luna Espinosa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

class JobManager {

	constructor( numWorkers ) {

		this.numWorkers = 0;

		this.workers = [ ];

		this.currentJobs = [ ];
		this.numRunningJobs = 0;

		this.setNumWorkers( numWorkers );

	}

	setNumWorkers( numWorkers ) {

		const scope = this;

		function onWorkerMessage( event ) {

			const message = event.data;
			let job;
			switch ( message.type ) {

				case 'jobResult':

					job = scope.getJobByWorkerIndex( message.workerIndex );
					if ( ! job ) return;

					scope.numRunningJobs --;
					scope.currentJobs[ message.workerIndex ] = null;
					job.onResult( message.result );

					break;

				case 'jobProgress':

					job = scope.getJobByWorkerIndex( message.workerIndex );
					if ( ! job || ! job.onProgress ) return;
					job.onProgress( message.completed, message.total, message.message );

					break;

			}

		}

		// Can't set number of workers while busy
		if ( this.numRunningJobs > 0 ) return false;

		this.numWorkers = numWorkers;

		// Add workers
		for ( let i = this.workers.length; i < numWorkers; i ++ ) {

			this.currentJobs.push( null );

			const worker = new Worker( new URL( './SlicerWorker.js', import.meta.url ) );
			this.workers.push( worker );

			worker.onmessage = onWorkerMessage;

			worker.postMessage( { type: "initIndex", workerIndex: i } );

		}

		// Remove workers
		for ( let i = this.workers.length - 1; i >= numWorkers; i -- ) {

			this.currentJobs.pop( null );

			this.workers[ i ].terminate();
			this.workers.pop();

		}

		return true;

	}

	postInitMessageToAllWorkers( message ) {

		message.type = 'initWorker';

		for ( let i = 0, l = this.workers.length; i < l; i ++ ) {

			this.workers[ i ].postMessage( message );

		}

	}

	executeJob( job ) {

		/*
			job = {
				parameters: Object with job data for the worker.
				onProgress( completed, total, message ): Optional callback called multiple times with job progress. The message parameter should only be set when it has changed.
				onResult( result ): Callback called once with the result.
			}

		*/

		// Find free worker

		if ( this.numRunningJobs >= this.numWorkers ) return false;

		let i = 0;
		while ( i < this.numWorkers ) {

			if ( this.currentJobs[ i ] === null ) break;

			i ++;

		}

		if ( i >= this.numWorkers ) return false;

		// Send the job to the worker

		this.numRunningJobs ++;
		this.currentJobs[ i ] = job;
		this.workers[ i ].postMessage( { type: "job", parameters: job.parameters } );

		return true;

	}

	executeJobSet( numJobs, onJobStart, onJobResult, onAllJobsFinished ) {

		/*

			Executes a sequence of jobs numbered with index from 0 to numJobs - 1. Progress callback is omitted.

			onJobStart( jobIndex ):
				Will be called just before launching the job number 'jobIndex'.
				The function must return the parameters object which will be passed to the worker, or null to
				indicate no more jobs will be sent in this set.

			onJobResult( result ): Will be called when a job finishes with a result parameter.

			onAllJobsFinished(): Will be called with no parameters when all jobs have completed. Optional.

		*/

		const scope = this;

		let currentJobIndex = 0;
		let numCompletedJobs = 0;
		let stoppedOnNull = false;
		let allJobsFinished = false;

		function onResult( result ) {

			onJobResult( result );

			if ( numCompletedJobs + 1 >= numJobs ) {

				if ( ! allJobsFinished && onAllJobsFinished ) {

					allJobsFinished = true;
					onAllJobsFinished();

				}

				return;

			}

			numCompletedJobs ++;

			sendNextJob();

		}

		function sendNextJob( ) {

			if ( currentJobIndex >= numJobs ) return false;

			const jobParameters = onJobStart( currentJobIndex );

			if ( jobParameters === null ) {

				if ( stoppedOnNull === false ) {

					// null object parameter indicates the end of jobs.
					numJobs = numCompletedJobs;
					stoppedOnNull = true;

					if ( ( scope.numRunningJobs === 0 ) && ( ! allJobsFinished && onAllJobsFinished ) ) {

						allJobsFinished = true;
						onAllJobsFinished();

					}

				}

				return false;

			}

			const jobCouldStart = scope.executeJob( {
				parameters: jobParameters,
				onResult: onResult
			} );

			if ( jobCouldStart ) currentJobIndex ++;

			return jobCouldStart;

		}

		// Launch jobs until all workers are busy
		while ( sendNextJob() );

	}

	getJobByWorkerIndex( workerIndex ) {

		const job = this.currentJobs[ workerIndex ];

		if ( job === null || this.numRunningJobs === 0 ) {

			console.error( "Internal error: Worker with workerIndex '" + workerIndex + "' probably sent too much 'jobResult' messages." );

		}
		else if ( job === undefined ) {

			console.error( "Internal error: Worker returned workerIndex '" + workerIndex + "' which is invalid (max: '" + ( this.numWorkers - 1 ) + "'." );

		}

		return job;

	}

}

export { JobManager };
