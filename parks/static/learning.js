document.addEventListener('DOMContentLoaded', function() {

    const select = document.querySelector('select');

    select.addEventListener('change', () => {
        // console.log('State:', select.value)
        
        const state = select.value;
        console.log('State:', state)

        // parks(state);

        // Send a POST request to the /parks route with the state value captured above.
        fetch(`/parks/${state}`, {
            method: 'POST',
            body: JSON.stringify({
                state: state
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log('Result:', result)
        });
        
    });
    
    // display_parks();
    
});


// const display_parks = (name) => {

// }