"use strict";

const main = {
  position(num) {
    return Math.floor(parseInt(num) / 10);
  },
  copy(json) {
    const spanJson = document.getElementById("copy-json");
    spanJson.innerText = JSON.stringify(json);

    const btnCopy = document.getElementById("btn-copy");

    btnCopy.addEventListener("click", (e) => {
      const constent = document.getElementById("copy-json").innerHTML;

      navigator.clipboard
        .writeText(constent)
        .then(() => {
          console.log("Text copied to clipboard...");
        })
        .catch((err) => {
          console.log("Something went wrong", err);
        });
    });
  },
  convertToJSON() {
    const svg = Array.from(document.getElementById("Manzana").children);
    // const tempSvg = Array.from(document.querySelectorAll("g"));

    console.log("svg: ", svg);

    let detailsSvg = new Array();

    let Manzanas = new Array();

    let blocks = new Array();

    let block = new Array();

    let position = 0;

    let svgJSON = {};

    svg.forEach((i) => {
      // console.log("ID: ",i.id)
      if(i.id != "Numeros"){
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
      let position = this.position(num);

      if (_Blocks[position] === undefined) {
        _Blocks[position] = new Array();
        _Blocks[position].push(M);
      } else {
        _Blocks[position].push(M);
      }
    });

    console.log("_Blocks: ", _Blocks);

    let viewBoxSVG = document.querySelector('svg').getAttribute('viewBox');
    svgJSON.blocks = _Blocks;
    let tempDetails = Array.from ( document.getElementById('Detalles').children);
    

    let details = tempDetails.map((e) =>{ return e.outerHTML })

    let temNnumeros = Array.from ( document.getElementById('Numeros').children)


    let numeros = temNnumeros.map((e) =>{ return e.outerHTML })


    
    svgJSON.details = [details,numeros];
    svgJSON.viewBoxSVG = [viewBoxSVG];

    // console.log("svgJSON: ",svgJSON )

    this.pintarJSON(svgJSON);
    this.copy(svgJSON);
    
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
          containerManzana.classList = "box-block";

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
};

const btnProcces = document.getElementById("btn-procces");

btnProcces.addEventListener("click", (e) => {
  const svg = document.getElementById("text-svg").value;

  const containerSvg = document.getElementById("svg");

  containerSvg.innerHTML = svg;

  main.convertToJSON();

  // main.main();
});