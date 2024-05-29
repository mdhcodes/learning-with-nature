document.addEventListener('DOMContentLoaded', function() {
    
    const select = document.querySelector('select');

    select.addEventListener('change', () => {

        const state = select.value;
        // console.log('State:', state)

        get_parks(state);
    });

});


const get_parks = (state) => {
    // console.log(state);
    // console.log(NP_API_KEY.value);
    const api_key = NP_API_KEY.value;

    // Send a GET request to the National Parks Service with the state value captured above.
    fetch(`https://developer.nps.gov/api/v1/parks?stateCode=${state}&api_key=${api_key}`)
    .then(response => {
        // console.log('Response:', response)
        return response.json();
    })
    .then(result => {
        console.log('Result:', result)
        const parks = document.getElementById('parks');
        const div = document.createElement('div');
        const p = document.createElement('p'); 
        p.innerHTML =  result.total;

        console.log('Data:', result.data)

        for (data in result.data) {
            console.log(result.data[data]);
        }

        div.append(p);
        parks.append(div);
        
    })
    .catch(error => {
        console.log('Error:', error)
    });

}