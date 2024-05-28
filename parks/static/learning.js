document.addEventListener('DOMContentLoaded', function() {
    //  https://ridwanray.medium.com/django-and-fetch-api-form-submissions-without-page-reloading-dc5106598005
    // "To prevent the page from reloading when the form is submitted, use JS Fetch API. Fetch API will be used to submit the form in the background and receive a response from the server." 
   
    const state_selected = document.querySelector('.state-selected');
    const select = document.querySelector('select');

    state_selected.addEventListener('submit', (e) => {        
        
        e.preventDefault();

        select.addEventListener('change', () => {

            const state = state_selected.value;
            console.log('State:', state)

            // Send a POST request to the /parks route with the state value captured above.
            fetch(`/parks/`, {
            // fetch(`parks/`, {
                method: 'POST',
                body: JSON.stringify({
                    state: state
                })
            })
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result)

                document.getElementById('park-info');
                
                
            })
            .catch(error => {
                console.log('Error:', error)

                document.getElementById('park-info').innerText = 'There was an error selecting a park. Please try again.'

            });

        });
        
        
    });


    
    
});