# Mince Slicer ![Mince Slicer icon](./icons/Mince.svg)

Mince Slicer is a 3D resin print slicing web application, featuring relief / emboss 3D textures.

Please keep in mind that this is experimental software. By using it you accept its MIT License:
```
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
```

## Usage

Mince Slicer runs in a modern web browser. It is a purely static web app. You can use it right now at the following URL:

https://yomboprime.github.io/MinceSlicer/dist/MinceSlicer.html

Or you can clone this repository and serve locally (`git` and [Node.js](https://nodejs.org) are required):

To install, issue this commands:

```
git clone https://github.com/yomboprime/MinceSlicer.git
cd MinceSlicer
npm install
```

To run (`ctrl-c` to quit):

```
npm start
```

The serve script will tell you on the console the URL to open Mince Slicer locally.

When the application is open you will see a 3D view of the build plate, and a main menu on the right.

- Note 1: To use Mince Slicer you will have to adjust machine and print settings correctly and according to your printer. Failing in doing so could result in failed prints or printer damage, or worse losses. Please refer to the settings section.
- Note 2: About overlapping solids, Mince Slicer can handle them correctly when anti-aliasing is off (value 1) and relief / emboss is off. If overlapping solids are present and these conditions are not met, the slicing will give incorrect results and the print will probably fail.



## Loading models

To load a model, image or project file, just drag it to the screen. Mince Slicer can load `.dae`, `.obj`, `.stl` (model files), `.mince` (project files) and images files.

When a model is loaded it will show in the 3D view, and in the 'objects list' in the main menu. You can select a model by clicking on it in this list. Only one object can be selected at a time.

Image files can also be loaded, to be used as textures in the relief / emboss section. They will be converted to grayscale. A list of loaded images is shown below the objects list.

## Main menu

The first four buttons in the menu select different tools. When a model is selected, you can use different 3D handlers with the mouse to edit the model.

### Tools buttons

- **Move tool** (Key **g**): You can move the model around the build plate (but not change its height position). Holding `Ctrl` key activates snap to integer millimeters.
- **Rotate tool** (Key **r**): You can rotate the model around different axes. Holding `Ctrl` key activates snap to multiples of 15 degrees.
- **Scale tool** (Key **s**): You can scale the model on different axes or uniformly. Holding `Ctrl` key activates snap to multiples of 50%.
- **Sit model on face** (Key **f**): Just click on a point in the model and it will be oriented so that it sits on that triangle.

Note that when moving an object out of the build plate (partially or not), it will show  a red box around it.

### View slice preview

By checking this option a preview horizontal section of the models is shown. You can adjust the height of the plane section with the two vertical handlers that are shown. An exact preview of the layer at that height will be shown on the section.

Keep in mind that when using anti-aliasing or relief / emboss textures, the preview can become very slow.

### Show build volume box

By checking this option a green box that delimits the build volume is shown. This option is saved with the settings.

### Reset view

This button resets the viewing camera angle and position to the initial state.

### Machine settings

Open this folder to show the machine settings:

- **Machine type**: You can type the name of your machine here. By default its value is "default".
- **Build volume** X, Y and Z: These are the dimensions of the usable build volume in millimeters. Getting them right is crucial to have your prints without distortions.
- **Layer height**: Set the layer height in millimeters.
- **Resolution** in X and Y (pixels): Set here the resolution of your printer.

- Mirror: Image mirror. Leave this value to 1 for normal operation.

### Print settings

In this folder you have the options that control exposure times, speeds, etc:

- **Number of bottom layers**: This number of initial layers will be made with different (usually higher) exposure times.
- **Normal layer exposure** (seconds): This is the exposure for normal layers (not the bottom ones) in seconds.
- **Bottom layer exposure** (seconds): Exposure time for bottom layers.
- **Normal layer lift speed** (mm/minute): Speed of the build plate when lifting to unstick from the FEP film, for the normal layers.
- **Bottom layer lift speed** (mm/minute): Speed of the build plate when lifting to unstick from the FEP film, for the bottom layers.
- **Drop speed** (mm/minute): Speed of the build plate when going down, for both normal and bottom layers.
- **Normal layer lift height** (mm): Distance to travel upwards when unsticking from the FEP, for normal layers.
- **Bottom layer lift height** (mm): Distance to travel upwards when unsticking from the FEP, for bottom layers.
- **Z slow up distance** (mm): I've not found much information on this parameter. I guess it is travel distance with slower movement to start unsticking from the FEP.
- **Bottom layer light off time** (seconds): Additional time period to wait with the UV lamp off, just after exposing (for bottom layers)
- **Normal layer light off time** (seconds): Additional time period to wait with the UV lamp off, just after exposing (for normal layers)
- **Resin density** (g/cm³): Resin density in grams per milliliter, or Kg per liter, which is the same. This is used just to calculate resin weight based on volume.
- **Resin price** per Kg: Coin units per Kg of resin. Just used to estimate resin print cost.
- **Anti-aliasing level** (1 to 4): If value is 1, no anti-aliasing is done in the slicing (and it is much faster). Values 2, 3 and 4 generate progressively smoother voxels. Higher values have a higher computing time.

### Global settings

- Max. number of workers: Number of parallel processes that will be run simultaneously to compute sliced layers. By default it is set to the number of system CPUs minus one.
- Max. distance in mm: Maximum size of viewable space in the 3D view. By default 2500 mm, you shouldn't need to change this, but perhaps someone has a very big build plate...

### Relief / emboss

This button opens up the relief / emboss 3D textures dialog. See the section on relief / emboss.

### Slice

Click this button to start the slicing. A progress dialog will appear. You can cancel the slicing by hitting the CANCEL button.

When slicing is finished, another dialog will appear, in which you can preview the sliced layers, see print information, and save the print file in ZIP format. You can also export the sliced voxels as a mesh, to STL format.

Mince Slicer outputs sliced files in a common ZIP file format. This file cannot be put directly in a printer, it has to be converted to a printable format first. To do so, you can use another utility. I use [uv3dp](https://github.com/ezrec/uv3dp). Once installed, convert your file by just doing this (for example, to convert the .zip to .ctb format):

```
uv3dp inputFile.zip outputFile.ctb
```

Please see the uv3dp documentation for supported file formats and file extensions.

### Clear build plate

This button removes all objects from the build plate.

### Save project

This button lets you save the project as a .mince file. It includes all models on the build plate, all loaded images and all settings including relief / emboss presets.

When loading a project by dragging a .mince file to the screen, a dialog will show asking what things do you want to load from the file: Models, images, machine settings, print settings and/or relief / emboss presets. So you can save projects with different settings and use them as templates.

### Save settings

This button saves all current settings to local storage in the browser, so they will be active the next time you open the application. This includes the relief / emboss presets.

### Restore settings to defaults

This option restores settings to the application default values. You can select what to restore: Machine settings, print settings, global settings, and/or relief / emboss presets.

### File name

Select here the project file name. It must have .mince extension.

### Reset selected object rotation

This will revert the selected object rotation to the rotation it initially had.

### Make copies of selected object

A dialog will appear when selecting this button, that lets you make copies of the selected object. A number of rows and columns is asked, and also the separation between the pieces. a total of `number of rows X number of columns - 1` new objects will be created, and they will be distributed evenly and centered in the build plate.

### Delete selected object

This button removes the selected object from the build plate and the objects list.

### Delete selected image

This button removes the selected image from the images list.



------



## Relief / emboss textures

Mince Slicer has the ability to apply a relief or emboss to the models while slicing (or both, we will refer to them simply as "relief" from now on). It may be called a "3D texture". The advantage of doing the relief in the slicing rather than editing the geometry is that the mesh file is smaller and more manageable. On the other hand, when using the relief the slice time can be very long (specially if used together with anti-aliasing)

To use the relief you normally need properly UV-mapped models (I say "normally" because Mince Slicer lets you define reliefs without using the UV coordinates, for example by using the XYZ coordinates. But this is not recommended as it can leave little portions of the model isolated from the main body). So to use reliefs, you should load UV-mapped models in .dae or .obj format, as .stl does not contain UV coordinates.

The relief defines values from 1 (maximum height above model) to -1 (minimum height under the model), with 0 meaning no relief or emboss at that point. Any value in-between is allowed, meaning that the relief is a height field relative to the model surface. This value is then multiplied by the thickness of the relief, defined in the relief preset, to obtain the final relief or emboss height or depth.

Reliefs are stored in presets (more on that later). Each relief preset has a root node with a tree of nodes hanging from it, which define the heightfield. Nodes represent arithmetic and other types of operations, so the relief heightfields are mathematical functions that give the height above the UV plane. See the following "Relief nodes" section for a description of all nodes and its parameters. But don't worry, there are predefined presets and you can use the "Image" or "Tiled image" presets to simply apply an image as a relief / emboss texture.

### Relief / emboss dialog

In this dialog you select the current relief preset being used, and can define new presets or delete them. To enable or disable the relief check or uncheck the "Relief/emboss enabled" option. You can close this dialog at any time ("CLOSE" button) and current relief configuration will be used in the slicing, but to store the presets for future use you should press the "Save settings" button in the main menu.

When the relief is enabled, you can see a preview of the texture at the top as a square image, in the UV space, with gray colors for positive height values (relief), and green colors for negative ones (emboss). The black color means a height of 0.

Besides selecting, cloning and deleting a preset, you will see three more options related to the currently selected preset:

- **Max. relief height/emboss depth** (mm): This is the final height of the relief (or depth of the emboss), corresponding to a value of 1 (resp. -1) of the relief node values.
- **Random seed** (float): This value is used in relief nodes that need pseudo-random numbers for the generation of the relief (usually noise nodes). Selecting a different value will change the noise and the texture.
- **Relief texture tree**: This is the tree of nodes, or more precisely the root node. Each node has a selection list to select its type, and then some parameter values depending on the node type. When one of this parameters is of type node, you can select in turn a node type for it, and its parameters will show inside a new folder, forming the nodes tree. Other types of parameter values are numbers, text strings, booleans, node arrays and images.

### Relief nodes

Following is the list of all node types with its parameters.

Some of the nodes have a parameter called "Mode". You can select this to be Relief, Emboss, or Both.

##### Arithmetic nodes

- Node Constant
- Node Add
- Node Negate
- Node Multiply
- Node Divide
- Node Power
- Node Mix
- Node Min
- Node Max
- Node LessThan
- Node Sin
- Node Cos

##### Miscelaneous nodes

- Node NotBottom
- Node Quantize
- Node ImageUV
- Node ImageTiledUV

##### Evaluation nodes

- Node GetU
- Node GetV
- Node GetX
- Node GetY
- Node GetZ
- Node Evaluate
- Node Preset
- Node MaterialSelector
- Node Multiplex

##### Noise nodes

- Node SimplexUV
- Node PerlinUV
- Node VoronoiUV

##### Geometric nodes

- Node Checkered
- Node Tiles
- Node Circles
- Node Spots

#### Node Constant

This node returns a constant value, which is its numeric parameter. It is used very often.

Parameters:

- Value (number): The constant value.

#### Node Add

Performs arithmetic addition of the parameter nodes A and B: A + B.

Parameters:

- A (node): First operand.
- B (node): Second operand.

#### Node Negate

Performs arithmetic negation of the parameter node A: - A

Parameters:

- A (node): Node to negate.

#### Node Multiply

Performs arithmetic product of the parameter nodes A and B: A * B

Parameters:

- A (node): First operand.
- B (node): Second operand

-

#### Node Divide

Performs arithmetic division of the parameter nodes A and B: A / B

Parameters:

- A (node): First operand.
- B (node): Second operand.

#### Node Power

Performs arithmetic power of the parameter nodes A and B: A^B

Parameters:

- A (node): First operand.
- B (node): Second operand.

#### Node Mix

Performs mixing of two node values by another node value that acts as a factor.

After clamping the factor to [0, 1], the return value is: Factor * A + ( 1 - Factor ) * B

Parameters:

- A (node): First value.
- B (node): Second value.
- Factor (node): Factor value for mixing.

#### Node Min

Performs arithmetic minimum of the parameter nodes A and B: minimum( A, B )

Parameters:

- A (node): First operand.
- B (node): Second operand.

#### Node Max

Performs arithmetic maximum of the parameter nodes A and B: maximum( A, B )

Parameters:

- A (node): First operand.
- B (node): Second operand.

#### Node LessThan

Performs arithmetic comparison "less than", A <= B of the parameter nodes A and B. Returns 1 if the inequality is satisfied, 0 otherwise.

Parameters:

- A (node): First operand.
- B (node): Second operand.

#### Node Sin

Returns the trigonometric sinus function of the parameter Node A.

Parameters:

- Mode: Defines the output values range. Can be Relief [0..1], Emboss [-1..0] or Relief_Emboss [-1..1].
- A (node): The argument to the sin function.

#### Node Cos

Returns the trigonometric cosinus function of the parameter Node A.

Parameters:

- Mode: Defines the output values range. Can be Relief [0..1], Emboss [-1..0] or Relief_Emboss [-1..1].
- A (node): The argument to the cos function.

#### Node NotBottom

Returns 1 if the face on the model is pointing upwards, 0 otherwise. Upwards meaning that the vertical component of the normal vector is >= 0.

Parameters: None.

#### Node Quantize

Flattens the output values to equal steps, like the lines in a topological map.

Parameters:

- Mode: Defines the output values range. Can be Relief [0..1], Emboss [-1..0] or Relief_Emboss [-1..1].
- A (node): The value to flatten to steps.
- Step size (node): The size of the step relative to the output range. For example, a value of 0.1 would generate 10 steps in Relief Mode.

#### Node ImageUV

Maps a loaded image as the heightfield, with offset and size. If you want to tile an image multiple times onto the surface, use ImageTiledUV node instead.

Parameters:

- Mode: Defines the output values range. Can be Relief [0..1], Emboss [-1..0] or Relief_Emboss [-1..1].
- Image size U (number): Image size in the U direction, in UV space units [0..1]
- Image size V (number): Image size in the V direction, in UV space units [0..1]
- Offset U (number): Image offset in the U direction, in UV space units [0..1]
- Offset V (number): Image offset in the V direction, in UV space units [0..1]
- Image (image): Select the image to be used (must be loaded previously)

#### Node ImageTiledUV

Maps a loaded image as the heightfield, tiled multiples times in U and V, with offset and size inside the tile.

Parameters:

- Mode: Defines the output values range. Can be Relief [0..1], Emboss [-1..0] or Relief_Emboss [-1..1].
- Size U (node): The Tile size in the U direction, in UV space units [0..1] For example, if Size U = 0.1, the image will be tiled 10 times in U direction.
- Size V (node): The Tile size in the V direction, in UV space units [0..1] For example, if Size V = 0.2, the image will be tiled 5 times in V direction.
- Image size U (number): Image size in the U direction, inside the tile (in tile space units [0..1])
- Image size V (number): Image size in the V direction, inside the tile (in tile space units [0..1])
- Offset U (number): Image offset in the U direction, inside the tile (in tile space units [0..1])
- Offset V (number): Image offset in the V direction, inside the tile (in tile space units [0..1])
- Image (image): Select the image to be used (must be loaded previously)

#### Node GetU

Outputs as value the U coordinate, from 0 to 1.

Parameters: None.

#### Node GetV

Outputs as value the V coordinate, from 0 to 1.

Parameters: None.

#### Node GetX

Outputs as value the X spatial coordinate (not clamped)

Parameters: None.

#### Node GetY

Outputs as value the Y spatial coordinate (not clamped)

Parameters: None.

#### Node GetZ

Outputs as value the Z spatial coordinate (not clamped)

Parameters: None.

#### Node Evaluate

Evaluate a node by passing to it as UV values the ones given by another two nodes.

Parameters:

- A (node): The node to be evaluated with UVs from the other two nodes.
- U (node): The node that gives the U value.
- V (node): The node that gives the V value.

#### Node Preset

Evaluates an existing Relief preset, just as it was another node.

Parameters:

- Preset name (preset): A Relief preset selected from the available presets.

#### Node MaterialSelector

Selects between a set of nodes depending on the material index of the point in the model.

Parameters:

- Materials (node array): Set of nodes to apply.

#### Node Multiplex

Selects between a set of nodes depending on the value of the Index parameter node.

Parameters:

- Nodes (node array): Set of materials to apply.
- Index (node ): The value of this node (not clamped and treated as an integer) is taken as index to the set of nodes.

#### Node SimplexUV

Returns the value of Simplex noise (generates a cloud-like image)

Parameters:

- Mode: Defines the output values range. Can be Relief [0..1], Emboss [-1..0] or Relief_Emboss [-1..1].
- Scale U (node): Size of the clouds in U direction.
- Scale V (node): Size of the clouds in V direction.

#### Node PerlinUV

Returns the value of Perlin noise (generates cloud-like images with more detail)

Parameters:

- Mode: Defines the output values range. Can be Relief [0..1], Emboss [-1..0] or Relief_Emboss [-1..1].
- Number of iterations (number): Number of times to cycle in the noise. The higher the value, the more detail but also more time to compute.
- Size (node): The size of the clouds.
- Size multiplier (node): Size of smaller clouds through each iteration.
- Contribution multiplier (node): Contribution of each iteration. Higher values makes rougher image.

#### Node VoronoiUV

Returns a voronoi image (like broken glass)

Parameters:

- Mode: Defines the output values range. Can be Relief [0..1], Emboss [-1..0] or Relief_Emboss [-1..1].
- Number of points (number): Number of fracture points. Increasing this value leads to higher computing time.
- Line thickness (node): Line thickness in UV units [0..1]

#### Node Checkered

Creates a checkered image.

Parameters:

- Mode: Defines the output values range. Can be Relief [0..1], Emboss [-1..0] or Relief_Emboss [-1..1].
- Size U (node): The checkered tile size in the U direction, in UV space units [0..1] For example, if Size U = 0.1, there will be 10 checkered tiles in U direction.
- Size V (node): The checkered tile size in the V direction, in UV space units [0..1] For example, if Size V = 0.05, there will be 20 checkered tiles in V direction.
- Checker fraction U (node): This parameter controls the fraction in U between "black tiles" and "white tiles". A 0 means they are equal. Setting towards -1 or 1 changes their relative fraction.
- Checker fraction V (node): This parameter controls the fraction in V between "black tiles" and "white tiles". A 0 means they are equal. Setting towards -1 or 1 changes their relative fraction.

#### Node Tiles

Creates a tiled surface, with beveled margins between the tiles.

Parameters:

- Mode: Defines the output values range. Can be Relief [0..1], Emboss [-1..0] or Relief_Emboss [-1..1].
- Size U (node): The tile size in the U direction, in UV space units [0..1] For example, if Size U = 0.1, there will be 10 tiles in U direction.
- Size V (node): The tile size in the V direction, in UV space units [0..1] For example, if Size V = 0.05, there will be 20 tiles in V direction.
- Bevel fraction (node): Size of the bevel separation relative to tile size.
- Alternated bricks (boolean): If true, tiles are alternated by half a tile in U in one every two rows, like in a typical bricked wall.

#### Node Circles

Makes a pattern of concentric circles.

Parameters:

- Mode: Defines the output values range. Can be Relief [0..1], Emboss [-1..0] or Relief_Emboss [-1..1].
- Number of circles (number): The number of concentric circles in the entire UV space.
- Offset U (node): This node is evaluated and added to the U coordinate.
- Offset V (node): This node is evaluated and added to the V coordinate.

#### Node Spots

Makes circles (better described as cones) in a tiled manner.

Parameters:

- Mode: Defines the output values range. Can be Relief [0..1], Emboss [-1..0] or Relief_Emboss [-1..1].
- Size U (node): The tile size in the U direction, in UV space units [0..1] For example, if Size U = 0.1, there will be 10 spots in U direction.
- Size V (node): The tile size in the V direction, in UV space units [0..1] For example, if Size V = 0.05, there will be 20 spots in V direction.
- Spot radius (node): The spot radius relative to tile size (radius = 1 for spots just touching each other)

------

## Development

Sources are in /src, distribution files are in /dist. To build, simply do:
```
npm run build
```

## TO-DO

- Add a proper nodes UI (connected boxes with properties instead of tree-like UI which is confusing when there are many nodes)
- Add support structures (maybe in the future)
