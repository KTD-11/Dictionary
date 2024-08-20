
let A = new Audio()

let definitions = document.getElementById('definitions'),
Synynoms = document.getElementById('Synynoms'),
Antonyms = document.getElementById('Antonyms'),
Other = document.getElementById('Other'); 

async function fetchWordV2(word) {
    try{
        let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    
        if (!response.ok) {
            //throw new Error(`There was an error fetching your word ${response.status}`); 
            swal.fire({
                title: "No Definitions Found",
                text: `We couldn't find a definition for the word "${word}", we're sorry for the inconvenience`,
                icon: "error",
              });
            
        }

        let data = await response.json();
        return data;
    }

    catch(err){
        console.log(`error status ${err}`);
        return null;
    }
}

async function init(x){
    let recieved = await fetchWordV2(x);

    if (!recieved) {
        console.error('No data received');
        return;
    }

    console.log(recieved);

    if (recieved[0].phonetics[1]?.text){
        document.querySelector('h3').innerText = recieved[0].phonetics[1].text;
    } else{
        document.querySelector('h3').innerText = recieved[0].phonetics[0].text;
    }   


    document.querySelector('section h1').innerText = x;

    const [entry] = recieved;
    const { phonetics, meanings } = entry;
    
    const audioAvailable = phonetics?.[0]?.audio;

    if (audioAvailable) {
        A.src = audioAvailable;
        document.querySelector('img').addEventListener('click', () => {
            A.play().catch(error => {
                console.error('Error playing audio:', error);
            });
        });

    } else {
        console.warn('No audio available for this word.');

        A.src = null;
        document.querySelector('img').addEventListener('click', () => {
            Swal.fire({
                title: 'No Audio Found',
                text: 'We couldn\'t find a recording for this word.',
                icon: 'error'
            });
        });
    }

    for (let y in recieved[0].meanings){
        
        for (let x in recieved[0].meanings[y].definitions){
    
            let p = document.createElement('p');

            
            p.innerText = `Definition (${recieved[0].meanings[y].partOfSpeech}) : ${recieved[0].meanings[y].definitions[x].definition}`;
            
            definitions.appendChild(p);
        }

        for(let z in recieved[0].meanings[y].synynoms){
                
            let pS = document.createElement('p');
            pS.innerText = `Synynom : ${recieved[0].meanings[y].synynoms[z]}`

            console.log(pS)

            Synynoms.appendChild(pS)
        }

        for(let a in recieved[0].meanings[y].antonyms){
            let pA = document.createElement('p');
            pA.innerText = `Antonym : ${recieved[0].meanings[y].antonyms[a]}`

            Antonyms.appendChild(pA)
        }
    }

    document.querySelector('section').scrollIntoView({
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });

}

document.querySelector('input').addEventListener('keyup', (event)=>{
    if(event.key === 'Enter'){
        init(document.querySelector('input').value);
        document.querySelector('input').value='';
        definitions.innerHTML = '';
        Antonyms.innerHTML = '';
        Synynoms.innerHTML = '';
    }
    
});


//`https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${API-KEY}`