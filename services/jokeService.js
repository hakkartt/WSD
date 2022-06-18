const fetchRandomJoke = async () => {
    const response = await fetch(
        // "https://rpi.yerzham.com/jokeapi/jokes/random",
        "https://official-joke-api.appspot.com/jokes/programming/random",
    );
    const content = await response.json();
    // console.log(typeof content);
    // console.log(content);
    return content;
  };
  
  export { fetchRandomJoke };
  