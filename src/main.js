const { invoke } = window.__TAURI__.core;

let greetInputEl;
let greetMsgEl;

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
}

async function getFolderDataFromPath(path){

  return await invoke("loadFolder",{path:path});
}

let container = document.getElementById("container")


function getPrevFolder(currentPath){
  let path = currentPath.split("/");

  if (path.length > 1) {
    path.pop()
  }
  if (path.length == 1) {
    return "/"
  }
  return path.join("/")
}

let currentPath = "/"

function back(){
  let prev = getPrevFolder(currentPath);
  getFolderDataFromPath(prev).then((data)=>{
    container.innerHTML = ""
    data.forEach((entry)=>{
      let element = document.createElement("p");
      element.textContent = entry

      if(!(prev == "/")){
        let back = document.createElement("p");
        back.textContent = ".."

        back.onclick = back
      }


      element.onclick = (ev) =>{
        let target = ev.target;
        currentPath = ev.target.textContent
  
        let current = document.getElementById("current-path");
        current.textContent = currentPath
  
        getFolderDataFromPath(currentPath).then((data)=>{
          container.innerHTML = ""
  
          data.forEach((entry)=>{
            let element = document.createElement("p");
            element.textContent = entry

            if(!(prev == "/")){
              let back = document.createElement("p");
              back.textContent = ".."
      
              back.onclick = back
            }

            container.appendChild(element)
          })
        })
  
      }

      container.appendChild(element)
      currentPath = prev

      let current = document.getElementById("current-path");
      current.textContent = currentPath
    })
  })
}

window.addEventListener("DOMContentLoaded",  async () => {

  let data = await getFolderDataFromPath(currentPath);

  let current = document.getElementById("current-path");
  current.textContent = currentPath

  data.forEach((entry)=>{
    let element = document.createElement("p");
    element.textContent = entry

    element.onclick = (ev) =>{
      let target = ev.target;
      currentPath = ev.target.textContent

      let current = document.getElementById("current-path");
      current.textContent = currentPath

      getFolderDataFromPath(currentPath).then((data)=>{
        container.innerHTML = ""

        let b = document.createElement("p");
        b.textContent = ".."

        b.onclick = back
        container.appendChild(b)

        data.forEach((entry)=>{
          let element = document.createElement("p");
          element.textContent = entry



          container.appendChild(element)
        })
      })

    }

    container.appendChild(element)
  })

  console.log(data)

});
