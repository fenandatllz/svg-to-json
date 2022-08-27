"use strict";

import { main, util } from './UI.js'
const btnNew = document.getElementById('btn-new')
const btnCopy = document.getElementById("btn-copy");

document.addEventListener('click', (e) => {
  // console.log("data-show")
  if (e.target.matches('[data-show]')) {
    let jsonClass = Array.from(e.target.classList)
    if (jsonClass.indexOf("showJSON") === -1) {
      e.target.classList.add('showJSON')
    } else {
      e.target.classList.remove('showJSON')
    }
  }
})

document.addEventListener('dragover', (e) => {
  e.preventDefault()
})

document.addEventListener('drop', (e) => {
  e.preventDefault()
  util.reload()

  if (e.dataTransfer.files.length) {
    var archivo = e.dataTransfer.files[0];
    if (!archivo) {
      return;
    }
    var lector = new FileReader();
    lector.onload = function (e) {
      var contenido = e.target.result;

      const containerSvg = document.getElementById("svg")

      containerSvg.innerHTML = contenido;
      let Pisos = document.getElementById("Pisos")
      let Manzanas = document.getElementById("Manzana")

      if (Manzanas) {
        main.convertToJSON_F();
      }

      if (Pisos) {
        main.convertToJSON_T();
      }
    };
    lector.readAsText(archivo);
  }
})

btnNew.addEventListener('click', () => {
  util.reload()
})

btnCopy.addEventListener("click", (e) => {
  const constent = document.getElementById("copy-json").innerHTML;

  navigator.clipboard
    .writeText(constent)
    .then(() => {
      console.log("Text copied to clipboard...");
      util.showAlert("sucess", "Text copied to clipboard...");
      util.closeAlert();
    })
    .catch((err) => {
      console.log("Something went wrong", err);
      util.showAlert("danger", "Something went wrong");
      util.closeAlert();
    });
});

const btnCopyCss = document.getElementById("btn-copy-css");
btnCopyCss.addEventListener("click", (e) => {
  let content = document.getElementById("copy-css").innerHTML;
  content = content.replace(/<br\s*\/?>/gi,' ')

  navigator.clipboard
    .writeText(content)    
    .then(() => {
      console.log("Text copied to clipboard...");
      util.showAlert("sucess", "Text copied to clipboard...");
      util.closeAlert();
    })
    .catch((err) => {
      console.log("Something went wrong", err);
      util.showAlert("danger", "Something went wrong");
      util.closeAlert();
    });
});