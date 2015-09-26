
//University of Illinois/NCSA Open Source License
//Copyright (c) 2015 University of Illinois
//All rights reserved.
//
//Developed by: 		Eric Shaffer
//                  Department of Computer Science
//                  University of Illinois at Urbana Champaign
//
//
//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
//documentation files (the "Software"), to deal with the Software without restriction, including without limitation
//the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
//to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//Redistributions of source code must retain the above copyright notice, this list of conditions and the following
//disclaimers.Redistributions in binary form must reproduce the above copyright notice, this list
//of conditions and the following disclaimers in the documentation and/or other materials provided with the distribution.
//Neither the names of <Name of Development Group, Name of Institution>, nor the names of its contributors may be
//used to endorse or promote products derived from this Software without specific prior written permission.
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
//WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//CONTRIBUTORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
//TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//DEALINGS WITH THE SOFTWARE.




//-------------------------------------------------------
// Global variables

var x_extent = [-1.0, 1.0];
var y_extent = [-1.0, 1.0];
var myGrid;
//var lines = {
//    "0000": [],
//    "0001": [0, 1, 1, 2],
//    "0010": [1, 2, 2, 1],
//    "0011": [0, 1, 2, 1],
//    "0100": [1, 0, 2, 1],
//    "0101": [1, 0, 2, 1, 0, 1, 1, 2],
//    "0110": [1, 0, 1, 2],
//    "0111": [1, 0, 0, 1],
//    "1000": [1, 0, 0, 1],
//    "1001": [1, 0, 1, 2],
//    "1010": [1, 0, 0, 1, 2, 1, 1, 2],
//    "1011": [1, 0, 2, 1],
//    "1100": [0, 1, 2, 1],
//    "1101": [2, 1, 1, 2],
//    "1110": [0, 1, 1, 2],
//    "1111": []
//};

var lines = {
    "0000": [],
    "0001": [0, 0, 0, 1, 1, 1, 0, 1],
    "0010": [1, 0, 1, 1, 0, 1, 1, 1],
    "0011": [0, 0, 0, 1, 1, 0, 1, 1],
    "0100": [0, 0, 1, 0, 1, 1, 1, 0],
    "0101": [0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1],
    "0110": [0, 0, 1, 0, 0, 1, 1, 1],
    "0111": [0, 0, 1, 0, 0, 0, 0, 1],
    "1000": [1, 0, 0, 0, 0, 1, 0, 0],
    "1001": [1, 0, 0, 0, 1, 1, 0, 1],
    "1010": [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1],
    "1011": [1, 0, 0, 0, 1, 0, 1, 1],
    "1100": [0, 1, 0, 0, 1, 1, 1, 0],
    "1101": [1, 1, 1, 0, 1, 1, 0, 1],
    "1110": [0, 1, 0, 0, 0, 1, 1, 1],
    "1111": []
};

var coord = {
    "00": 0,
    "10": 1,
    "11": 2,
    "01": 3
}
//------------------------------------------------------
//MAIN
function main() {
    render();
}

//--Function: render-------------------------------------
//Main drawing function

function render(canvas) {
    var res = parseFloat(document.getElementById("grid_res").value);
    myGrid = new UGrid2D([x_extent[0], y_extent[0]], [x_extent[1], y_extent[1]], res);
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log(' Failed to retrieve the < canvas > element');
        return false;
    }
    else {
        console.log(' Got < canvas > element ');
    }


// Get the rendering context for 2DCG <- (2)
    var ctx = canvas.getContext('2d');
//    ctx.clearRect(0, 0, canvas.width, canvas.height);

// Draw the scalar data using an image rpresentation
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
// Choose the scalar function
    var scalar_func = gaussian;
    if (document.getElementById("Sine").checked)
        scalar_func = sin2D;
//Determine the data range...useful for the color mapping
    var mn = scalar_func(pixel2pt(canvas.width, canvas.height, x_extent, y_extent, 0, 0));
    var mx = mn
    for (var y = 0; y < canvas.height; y++)
        for (var x = 0; x < canvas.width; x++)
        {
            var fval = scalar_func(pixel2pt(canvas.width, canvas.height, x_extent, y_extent, x, y));
            if (fval < mn)
                mn = fval;
            if (fval > mx)
                mx = fval;
        }

// Set the colormap based in the radio button
    var color_func = rainbow_colormap;
    if (document.getElementById("greyscale").checked) {
        color_func = greyscale_map;
    }
    else if (document.getElementById("twocolor").checked) {
        color_func = twocolor_map;
    }


//Color the domain according to the scalar value
    for (var y = 0; y < canvas.height; y++)
        for (var x = 0; x < canvas.width; x++)
        {
            var fval = scalar_func(pixel2pt(canvas.width, canvas.height, x_extent, y_extent, x, y));
            var color = color_func(fval, mn, mx);
            i = (y * canvas.width + x) * 4;
            imgData.data[i] = color[0];
            imgData.data[i + 1] = color[1];
            imgData.data[i + 2] = color[2];
            imgData.data[i + 3] = color[3];
        }

    ctx.putImageData(imgData, 0, 0);
    var contour_vals = document.getElementById("contour_vals").value;
    var cnt_arr = contour_vals.split(",");
//    console.log(cnt_arr);
    for (var cnt = 0; cnt < cnt_arr.length; cnt++) {
        var isovalue = Number(cnt_arr[cnt].trim());
        console.log("isovalue=" + isovalue);
        var resolution = res;
        var step = canvas.width / resolution;
        var flag = 0;
        for (var y = 0; y < canvas.height; y = y + step) {
            if (flag > 0) {
//                break;
            }
            for (var x = 0; x < canvas.width; x = x + step) {
//            console.log("x=" + x + " y=" + y);
//            var cc = pixel2pt(canvas.width, canvas.height, x_extent, y_extent, x, y);
//            console.log("cx=" + cc[0] + " cy=" + cc[1]);
                var fval = [];
                fval[0] = scalar_func(pixel2pt(canvas.width, canvas.height, x_extent, y_extent, x, y));
                fval[1] = scalar_func(pixel2pt(canvas.width, canvas.height, x_extent, y_extent, x + step, y));
                fval[2] = scalar_func(pixel2pt(canvas.width, canvas.height, x_extent, y_extent, x + step, y + step));
                fval[3] = scalar_func(pixel2pt(canvas.width, canvas.height, x_extent, y_extent, x, y + step));
                var key = (fval[0] > isovalue) ? "1" : "0";
                key += (fval[1] > isovalue) ? "1" : "0";
                key += (fval[2] > isovalue) ? "1" : "0";
                key += (fval[3] > isovalue) ? "1" : "0";
                //resolve the ambiguous case 
                if (key == "0101" || key == "1010") {
                    var fval_mid = scalar_func(pixel2pt(canvas.width, canvas.height, x_extent, y_extent, x + (step / 2), y + (step / 2)));
                    var mid_ = (fval_mid > isovalue) ? "1" : "0";
                    if (key = "0101" && mid_ == "1") {
                        key = "1010";
                    } else if (key = "1010" && mid_ == "1") {
                        key = "0101";
                    }
                }
                if (key != "0000" && key != "1111") {
//                    console.log("genline for x=" + x + " y=" + y + " key=" + key);
                    generateLine(canvas, x, y, step, key, fval, isovalue);
                    flag++;
//                    break;
                }
            }
        }
    }

// Draw the grid if necessary
    if (document.getElementById("show_grid").checked)
        myGrid.draw_grid(canvas);
}

//--------------------------------------------------------
// Map a point in pixel coordinates to the 2D function domain
function pixel2pt(width, height, x_extent, y_extent, p_x, p_y) {
    var pt = [0, 0];
    xlen = x_extent[1] - x_extent[0]
    ylen = y_extent[1] - y_extent[0]
    pt[0] = (p_x / width) * xlen + x_extent[0];
    pt[1] = (p_y / height) * ylen + y_extent[0];
    return pt;
}

//--------------------------------------------------------
// Map a point in domain coordinates to pixel coordinates
function pt2pixel(width, height, x_extent, y_extent, p_x, p_y) {
    var pt = [0, 0];
    var xlen = (p_x - x_extent[0]) / (x_extent[1] - x_extent[0]);
    var ylen = (p_y - y_extent[0]) / (y_extent[1] - y_extent[0]);
    pt[0] = Math.round(xlen * width);
    pt[1] = Math.round(ylen * height);
    return pt;
}

//------------------------------------------------------------
function generateLine(canvas, x, y, step, key, fval, cnt) {
//    console.log("generate lines " + x + " " + y + " " + step + " " + key);
    var ctx = canvas.getContext('2d');
    p = lines[key];
//    var half_step = step / 2;
    for (var i = 0; i < p.length; i += 8) {
        var point1 = interpolate(x + step * p[i], y + step * p[i + 1], fval[getCoords(p[i], p[i + 1])], x + step * p[i + 2], y + step * p[i + 3], fval[getCoords(p[i + 2], p[i + 3])], cnt);
        var point2 = interpolate(x + step * p[i + 4], y + step * p[i + 5], fval[getCoords(p[i + 4], p[i + 5])], x + step * p[i + 6], y + step * p[i + 7], fval[getCoords(p[i + 6], p[i + 7])], cnt);
//        console.log(point1);
        ctx.beginPath();
        ctx.moveTo(point1[0], point1[1]);
        ctx.lineTo(point2[0], point2[1]);
        ctx.lineWidth = 1;
        // set line color
        ctx.strokeStyle = '#000000';
        ctx.stroke();
    }
}

function interpolate(x0, y0, fv0, x1, y1, fv1, f) {
//    console.log(x0 + " " + y0 + " " + fv0 + " " + x1 + " " + y1 + " " + fv1 + " " + f);
    var t = (fv0 - f) / (fv0 - fv1);
    var x = x0 + t * (x1 - x0);
    var y = y0 + t * (y1 - y0);
    return [x, y];
}


function getCoords(x, y) {
    var str = x + "" + y;
//    console.log(str);
    return coord[str];
}
