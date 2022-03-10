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
    const svg = Array.from(document.querySelectorAll("g"));
    console.log("svg: ", svg);

    const jsonDiv = document.getElementById("json");

    let detailsSvg = new Array();

    let Manzanas = new Array();

    let blocks = new Array();

    let block = new Array();

    let position = 0;

    let svgJSON = {};

    svg.forEach((i) => {
      console.log("Index: ", i.id.charAt(0), " - id: ", i.id);
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

        Manzanas.push(manzanasJSON);
      }
    });

    console.log("Manzanas: ", Manzanas);

    Manzanas.sort(
      (a, b) => a.Numero.replace(/\D+/g, "") - b.Numero.replace(/\D+/g, "")
    );
    // console.log("Manzanas", Manzanas)

    // Manzanas.forEach((M) => {
    //   let num = M.Numero.replace(/\D+/g, "");
    //   position = this.position(num);
    //   if (blocks[position] === undefined) {
    //     block.push(M);
    //     blocks = Array.from(block);
    //   }
    // });

    // console.log("blocks: ", blocks);

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

      // Manzanas.forEach((_M) => {
      //   let _item = new Array();
      //   let _num = _M.Numero.replace(/\D+/g, "");
      //   let _position = this.position(_num);

      //   if (position == _position) {
      //     if (_Blocks[position] === undefined) _Blocks[position] = new Array();
      //     _Blocks[position].push(_M);
      //   }
      // });
    });

    console.log("_Blocks: ", _Blocks);

    svgJSON.blocks = _Blocks;

    const cls = [
      "cls-4",
      "cls-5",
      "cls-6",
      "cls-7",
      "cls-8",
      "cls-9",
      "cls-10",
      "cls-11",
      "cls-12",
    ];

    cls.forEach((cl) => {
      const cls3 = Array.from(document.querySelectorAll(`.${cl}`));
      let tempCls = cls3.map((cls) => {
        return cls.outerHTML;
      });
      detailsSvg.push(tempCls);
    });

    svgJSON.details = detailsSvg;

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
