const retrieveContentFromApi = async () => {
    const response = await fetch("/api/magic");
    const json = await response.json();
    console.log(json);
    const element = document.createElement("text");
    const content = document.createTextNode(JSON.stringify(json));
    element.appendChild(content);
    document.querySelector("#magic").appendChild(element);
  };
  