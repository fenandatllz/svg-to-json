"use strict";

const util = {
    position(num) {
        return Math.floor(parseInt(num) / 10);
    },
    copy(json) {
        const spanJson = document.getElementById("copy-json");
        spanJson.innerText = JSON.stringify(json);
    },
    copyCSS(css){
        const spanCSS = document.getElementById("copy-css");
        spanCSS.innerText = css;
    },
    reload() {
        const containerJSON = document.getElementById("json");
        const listado = document.getElementById("listado");
        const copy = document.getElementById("copy-json");
        const copyCSS = document.getElementById("copy-css");
        const svg = document.getElementById("svg");

        containerJSON.innerHTML = "";
        listado.innerHTML = "";
        copy.innerHTML = "";
        copyCSS.innerHTML = "";
        svg.innerHTML = "";
        window.scrollTo({
            top: 0,
        });
    },
    pintarJSON(svgJSON) {
        const containerJSON = document.getElementById("json");

        const container_Blocks = document.createElement("div");
        container_Blocks.classList = "container_boxBlock";

        const listado = document.getElementById("listado");
        listado.classList = "box listado";

        svgJSON.blocks.forEach((block, index) => {
            if (block.length !== 0) {
                const boxBlock = document.createElement("div");
                boxBlock.classList = "box-block";
                const titleBlock = document.createElement("h3");
                titleBlock.innerText = `Block: ${index}`;

                boxBlock.appendChild(titleBlock);

                const blockList = document.createElement("ol");
                blockList.classList = "ol-manzana";
                blockList.innerText = `Block: ${index}`;
                listado.appendChild(blockList);

                block.forEach((Manzana) => {
                    const num = document.createElement("li");
                    num.classList = "li-manzana";
                    num.innerText = `${JSON.stringify(Manzana.Numero)}`;
                    blockList.appendChild(num);

                    const containerManzana = document.createElement("div");
                    containerManzana.classList = "box-block-m";

                    const numero = document.createElement("h5");
                    numero.classList = "escalon numero";
                    numero.innerHTML = `<h3>Numero:</h3> <span> ${JSON.stringify(
                        Manzana.Numero
                    )}<span>`;
                    containerManzana.appendChild(numero);

                    const pach = document.createElement("p");
                    pach.classList = "escalon pach";
                    const titlePath = document.createElement("h3");
                    titlePath.innerText = "path:";
                    pach.appendChild(titlePath);
                    const span = document.createElement("span");
                    span.innerText = `${JSON.stringify(Manzana.path)}`;
                    pach.appendChild(span);
                    containerManzana.appendChild(pach);

                    const Lotes = document.createElement("div");
                    Lotes.classList = "escalon Lotes";
                    Lotes.innerHTML = "<h3>Lotes:</h3>";

                    Manzana.Lotes.forEach((lote) => {
                        const Lote = document.createElement("div");

                        Lote.classList = "escalon Lote";
                        Lote.innerText = JSON.stringify(lote);

                        Lotes.appendChild(Lote);
                    });

                    containerManzana.appendChild(Lotes);
                    boxBlock.appendChild(containerManzana);
                });

                container_Blocks.appendChild(boxBlock);
            }
        });

        containerJSON.appendChild(container_Blocks);
    },
    showAlert(type, msg) {
        const divAlert = document.getElementById("alert");
        divAlert.innerHTML = `<p>${msg}</p> <span>x</span>`;
        divAlert.classList.add("show", `${type}`);
    },
    closeAlert() {
        const divAlert = document.getElementById("alert");
        setTimeout(function () {
            divAlert.classList.remove("show");
        }, 3500);
    },
};

const main = {
    convertToJSON_F() {
        let css = document.getElementsByTagName('style')
        if(css.length == 1)
        {
            css = css[0].innerHTML
 
        }
        else{
            css = css[1].innerHTML
        }

        const svg = Array.from(document.getElementById("Manzana").children);
        let Manzanas = new Array();
        let svgJSON = {};

        svg.forEach((i) => {
            // console.log("ID: ",i.id)
            if (i.id != "Numeros") {
                // console.log("Index: ", i.id.charAt(0), " - id: ", i.id);
                if (i.id.charAt(0) === "M") {
                    let manzanasJSON = {};

                    manzanasJSON.Numero = i.id;

                    // console.log("i.id: ", i.id);

                    let c = Array.from(i.children);

                    let tempPath = c.filter((e) => {
                        // console.log("id: ", e.id)
                        if (!e.id.includes(`-L`) && !e.id.includes(`-A`)) {
                            e.dataset.manzana = i.id;
                            return JSON.stringify(e.outerHTML);
                        }
                    });
                    // console.log("tempPath: ", tempPath)

                    manzanasJSON.path = tempPath[0]?.outerHTML;

                    let Lotes = c.filter((x) => {
                        if (x.id.includes(`${i.id}-L`) || x.id.includes(`${i.id}-A`)) {
                            if (x.id.includes(`-E`)) {
                                let id = x.id;
                                let splitId = id.split(`-E`)
                                // console.log("splitId: ", splitId)
                                x.dataset.entregable = "true"
                                x.id = splitId[0]
                            }
                            if (x.id.includes(`${i.id}-L`)) {
                                x.dataset.lote = "";
                            }

                            return JSON.stringify(x.outerHTML);
                        }
                    });
                    // console.log("Lotes", Lotes)

                    manzanasJSON.Lotes = Lotes.map((x) => {
                        return x.outerHTML;
                    });

                    // console.log("manzanasJSON: ", manzanasJSON)

                    Manzanas.push(manzanasJSON);
                }
            }
        });

        console.log("Manzanas: ", Manzanas);

        Manzanas.sort(
            (a, b) => a.Numero.replace(/\D+/g, "") - b.Numero.replace(/\D+/g, "")
        );

        let _Blocks = new Array();
        Manzanas.forEach((M) => {
            let num = M.Numero.replace(/\D+/g, "");
            let position = util.position(num);

            if (_Blocks[position] === undefined) {
                _Blocks[position] = new Array();
                _Blocks[position].push(M);
            } else {
                _Blocks[position].push(M);
            }
        });

        console.log("_Blocks: ", _Blocks);

        let viewBoxSVG = document.querySelector("svg").getAttribute("viewBox");
        svgJSON.blocks = _Blocks;
        let tempDetails = Array.from(document.getElementById("Detalles").children);

        let details = tempDetails.map((e) => {
            return e.outerHTML;
        });

        let temNnumeros = Array.from(document.getElementById("Numeros").children);

        let numeros = temNnumeros.map((e) => {
            return e.outerHTML;
        });

        svgJSON.details = [details, numeros];
        svgJSON.viewBoxSVG = [viewBoxSVG];

        // console.log("svgJSON: ",svgJSON )

        util.pintarJSON(svgJSON);
        util.copy(svgJSON);
        util.copyCSS(css);
    },
    convertToJSON_T() {
        let css = document.getElementsByTagName('style')
        if(css.length == 1)
        {
            css = css[0].innerHTML
 
        }
        else{
            css = css[1].innerHTML
        }
        
        const svg = Array.from(document.getElementById("Pisos").children);
        let Pisos = new Array();
        let svgJSON = {};

        svg.forEach((i) => {
            // console.log("ID: ",i.id)
            if (i.id != "Numeros") {
                // console.log("Index: ", i.id.charAt(0), " - id: ", i.id);
                if (i.id.charAt(0) === "P") {
                    let pisosJSON = {};

                    pisosJSON.Numero = i.id;

                    // console.log("i.id: ", i.id);

                    let c = Array.from(i.children);

                    let tempPath = c.filter((e) => {
                        // console.log("id: ", e.id)
                        if (!e.id.includes(`-D`) && !e.id.includes(`-A`)) {
                            
                            if (e.id.includes(`-X`)) {
                                let id = e.id;
                                let splitId = id.split(`-X`)
                                console.log("splitId: ", splitId)
                                e.dataset.detalle = `D-${splitId[1]}`
                                e.id = splitId[0]
                                e.dataset.piso =  i.id;
                            }else{
                                e.dataset.piso = i.id;
                            }
                            return JSON.stringify(e.outerHTML);
                        }
                    });
                    // console.log("tempPath: ", tempPath)

                    pisosJSON.path = tempPath[0]?.outerHTML;

                    let Lotes = c.filter((x) => {
                        if (x.id.includes(`${i.id}-D`) || x.id.includes(`${i.id}-A`)) {
                            if (x.id.includes(`${i.id}-D`)) {
                                x.dataset.lote = "";
                            }

                            return JSON.stringify(x.outerHTML);
                        }
                    });
                    // console.log("Lotes", Lotes)

                    pisosJSON.Lotes = Lotes.map((x) => {
                        return x.outerHTML;
                    });

                    // console.log("manzanasJSON: ", manzanasJSON)

                    Pisos.push(pisosJSON);
                }
            }
        });

        console.log("Pisos: ", Pisos);

        Pisos.sort(
            (a, b) => a.Numero.replace(/\D+/g, "") - b.Numero.replace(/\D+/g, "")
        );

        let _Blocks = new Array();
        Pisos.forEach((P) => {
            let num = P.Numero.replace(/\D+/g, "");
            let position = util.position(num);

            if (_Blocks[position] === undefined) {
                _Blocks[position] = new Array();
                _Blocks[position].push(P);
            } else {
                _Blocks[position].push(P);
            }
        });

        console.log("_Blocks: ", _Blocks);

        let viewBoxSVG = document.querySelector("svg").getAttribute("viewBox");
        svgJSON.blocks = _Blocks;
        let tempDetails = Array.from(document.getElementById("Detalles").children);
        let cont = 1
        let lengthDetails = new Array()
        let details = tempDetails.map((e) => {
            
            if (e.id.includes(`D-`)) {
                let detalle = `D-${cont}`
                // e.dataset.detalle = detalle
                lengthDetails.push(detalle)
                cont ++
            }
            return e.outerHTML;
        });

        let temNnumeros = Array.from(document.getElementById("Numeros").children);

        let numeros = temNnumeros.map((e) => {
            return e.outerHTML;
        });

        svgJSON.details = [details, numeros];
        svgJSON.lengthDetails = lengthDetails
        svgJSON.viewBoxSVG = [viewBoxSVG];

        // console.log("svgJSON: ",svgJSON )

        util.pintarJSON(svgJSON);
        util.copy(svgJSON);
        util.copyCSS(css);
    },
};

export { main, util };
