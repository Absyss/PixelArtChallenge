var gridSpace = document.getElementById("pixelGrid");

//selectable draw modes
const draw = 'draw';
const erase = 'erase';
const fill = 'fill';

// the pixel art space
const element = $("#html-content-holder");
//storage for converted canvas
var getCanvas;
//datatype for download
var dataType;

//variable for currently selected color, default white -> nothing
var color = 'white';
var mode = 'draw';
var gridSizeSaver;


//initiate grid table on load
$(document).ready(function () {
    buildGrid(16);
    addColorListener();
    openDownloadModal()
});


//function to build a grid canvas
function buildGrid(gridSize) {
    //first we delete old grid
    while (gridSpace.firstChild) {
        gridSpace.removeChild(gridSpace.firstChild);
    }
    gridSizeSaver = gridSize;
    let idCounter = 1;
    for (let row = 0; row < gridSize; row++) {
        let gridRow = document.createElement('tr');
        gridSpace.appendChild(gridRow);
        for (let col = 0; col < gridSize; col++) {
            let gridCol = document.createElement('td');
            gridCol.setAttribute('id', idCounter.toString());
            gridRow.appendChild(gridCol);
            idCounter++;

            //listeners for grid interaction
            gridCol.addEventListener('click', function () {
                switch (mode) {
                    case draw:
                        this.style.backgroundColor = color;
                        break;
                    case erase:
                        this.style.backgroundColor = 'white';
                        break;
                    case fill:
                        fillNeighbourPixels(this.id, this.style.backgroundColor);
                        break;

                }
            });

        }
    }
}

//method for site creation. Adds the select color functionality to colors
function addColorListener() {
    //iterates all elements of class colorPixel
    $('.colorPixel').each(function (i, obj) {
        obj.addEventListener('click', function changeSelectedColor() {
            color = this.style.backgroundColor;
            $('.colorPixel').each(function (i, obj) {
                obj.style.borderColor = 'black';
            });
            this.style.borderColor = 'white';
        })
    })
}

//finds neighbours through sibling elements and id for vertical nav.
function fillNeighbourPixels(id, filler) {

    let centralPixels = [id, parseInt(id) + gridSizeSaver, id - gridSizeSaver];
    centralPixels.forEach(function (item) {
        console.log(item);
        let neighbour = document.getElementById(item);
        if (neighbour != null) {
            neighbour.style.backgroundColor = filler;
            let siblings = neighbour.nextElementSibling;
            if (siblings != null) {
                siblings.style.backgroundColor = filler;
            }
            siblings = neighbour.previousElementSibling;
            if (siblings != null) {
                siblings.style.backgroundColor = filler;
            }
        }
    });
}

//Drawing Mode selection
function chooseEraseMode() {
    mode = erase;
}

function chooseDrawMode() {
    mode = draw;
}

function chooseBucketMode() {
    mode = fill;
}

//Custom Color Change
function changeCustomColor() {
    document.getElementById("customColor").style.backgroundColor = document.getElementById("changeColor").value
}

//DataType Change for Download Modal
function changeDataType() {
    dataType = $("#selectDataType").val().toString();
    recompileImageDate()
}



//function that adds the conversion from the grid table to a picture
//currently gif is accepted mime type but most browsers seem to not support it
function openDownloadModal() {
    $("#downloadStart").on('click', function () {
        //empty canvas space
        const myNode = document.getElementById("preview");
        myNode.innerHTML = '';
        //transform table into a canvas
        html2canvas(element, {
            onrendered: function (canvas) {
                //append new canvas to modal preview
                $("#preview").append(canvas);
                getCanvas = canvas;

                //selected data type
                dataType = $("#selectDataType").val().toString();
                //transform canvas to picture and append to download href
                var imgageData = getCanvas.toDataURL("image/" + dataType);
                console.log(dataType);
                var newData;
                var downloadBtn = $("#download");
                //switch according to data type
                switch (dataType) {
                    case "png":
                        newData = imgageData.replace(/^data:image\/png/, "data:application/octet-stream");
                        downloadBtn.attr("download", "pixelart.png").attr("href", newData);
                        break;
                    case "jpeg":
                        newData = imgageData.replace(/^data:image\/jpeg/, "data:application/octet-stream");
                        downloadBtn.attr("download", "pixelart.jpg").attr("href", newData);
                        break;
                    case "gif":
                        newData = imgageData.replace(/^data:image\/gif/, "data:application/octet-stream");
                        downloadBtn.attr("download", "pixelart.gif").attr("href", newData);
                }

            }
        });
    });
}

//attaches the Pixelart as a different data type to the download btn. Gif not yet supported my some browsers it seems.
function recompileImageDate() {
    var downloadBtn = $("#download");
    switch (dataType) {
        case "png":
            downloadBtn.attr("download", "pixelart.png").attr("href", getCanvas.toDataURL("image/" + dataType).replace(/^data:image\/png/, "data:application/octet-stream"));
            break;
        case "jpeg":
            downloadBtn.attr("download", "pixelart.jpg").attr("href", getCanvas.toDataURL("image/" + dataType).replace(/^data:image\/jpeg/, "data:application/octet-stream"));
            break;
        case "gif":
            downloadBtn.attr("download", "pixelart.gif").attr("href", getCanvas.toDataURL("image/" + dataType).replace("image/gif", "image/octet-stream"));

    }
}

