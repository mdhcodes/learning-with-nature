document.addEventListener('DOMContentLoaded', function() {
    
    const select = document.querySelector('select');

    select.addEventListener('change', () => {

        const state = select.value;
        // console.log('State:', state)

        get_parks(state);
    });

});


const full_state_names = {
    'AK': 'Alaska',
    'AL': 'Alabama',
    'AR': 'Arkansas',
    'AZ': 'Arizona',
    'CA': 'California',
    'CO': 'Colorado',
    'CT': 'Connecticut',
    'DC': 'District of Columbia',
    'DE': 'Delaware',
    'FL': 'Florida',
    'GA': 'Georgia',
    'HI': 'Hawaii',
    'IA': 'Iowa',
    'ID': 'Idaho',
    'IL': 'Illinois',
    'IN': 'Indiana',
    'KS': 'Kansas',
    'KY': 'Kentucky',
    'LA': 'Louisiana',
    'MA': 'Massachusetts',
    'MD': 'Maryland',
    'ME': 'Maine',
    'MI': 'Michigan',
    'MN': 'Minnesota',
    'MO': 'Missouri',
    'MS': 'Mississippi',
    'MT': 'Montana',
    'NC': 'North Carolina',
    'ND': 'North Dakota',
    'NE': 'Nebraska',
    'NH': 'New Hampshire',
    'NJ': 'New Jersey',
    'NM': 'New Mexico',
    'NV': 'Nevada',
    'NY': 'New York',
    'OH': 'Ohio',
    'OK': 'Oklahoma',
    'OR': 'Oregon',
    'PA': 'Pennsylvania',
    'PR': 'Puerto Rico',
    'RI': 'Rhode Island',
    'SC': 'South Carolina',
    'SD': 'South Dakota',
    'TN': 'Tennessee',
    'TX': 'Texas',
    'UT': 'Utah',
    'VA': 'Virginia',
    'VT': 'Vermont',
    'WA': 'Washington',
    'WI': 'Wisconsin',
    'WV': 'West Virginia',
    'WY': 'Wyoming'
}


const get_parks = (state) => {
    // console.log(state);
    // console.log(NP_API_KEY.value);
    const api_key = NP_API_KEY.value;

    const state_name = full_state_names[state];
    console.log('State Name', state_name)

    // Send a GET request to the National Parks Service with the state value captured above.
    fetch(`https://developer.nps.gov/api/v1/parks?stateCode=${state}&api_key=${api_key}`)
    .then(response => {
        // console.log('Response:', response)
        return response.json();
    })
    .then(result => {
        // console.log('Result:', result)

        // Hide park search-by-state div.
        document.getElementById('search-by-state').style.display = 'none';

        const state_parks = document.getElementById('state-parks');
        const div = document.createElement('div');
        const location = document.createElement('h1'); 
        location.innerHTML = `${state_name} - ${result.total} National Parks`;
        div.append(location);

        console.log('Data:', result.data)

        for (data in result.data) {
            const park_name = document.createElement('h3');
            park_name.setAttribute('class', 'park-name');
            const park_link = document.createElement('a');
            park_link.innerHTML = result.data[data].fullName; 
            park_link.setAttribute('href', '#'); // The park_link event listener contains the endpoint to fetch when clicked.
            const park_code = result.data[data].parkCode;
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind
            // bind() will pass the variable park_code without invoking the get_park function.
            park_link.addEventListener('click', get_park_lessons.bind(null, park_code)); // get_park(park_code) immediately invokes the get_park function.
            park_name.append(park_link);         
            div.append(park_name);
            park_city = document.createElement('p');
            park_city.innerHTML = result.data[data].addresses[0].city;        
            div.append(park_city);
            park_state = document.createElement('p');
            park_state = result.data[data].addresses[0].stateCode;        
            div.append(park_state);
            park_description = document.createElement('p');
            park_description.innerHTML = result.data[data].description;     
            div.append(park_description);
            // park_image = document.createElement('img');
            // park_image.setAttribute('src', result.data[data].images[0].url)
            // park_image.setAttribute('alt', result.data[data].images[0].altText)   
            // div.append(park_image);
        }
       
        state_parks.append(div);
                
    })
    .catch(error => {
        console.log('Error:', error)
    });

}


const get_park_lessons = (park_code) => {
    console.log('Park Code:', park_code)

    const api_key = NP_API_KEY.value;

    
    // Send a GET request to the National Parks Service with the park_code value.
    fetch(`https://developer.nps.gov/api/v1/parks?parkCode=${park_code}&api_key=${api_key}`)
    .then(response => {
        // console.log('Response:', response)
        return response.json();
    })
    .then(result => {
        console.log('Result:', result)
        const state_park = document.getElementById('state-park');

        // Hide the search-by-state and state-parks divs.
        document.getElementById('search-by-state').style.display = 'none';
        document.getElementById('state-parks').style.display = 'none';

        // Display the state-park div
        state_park.style.display = 'block';

        const park_name = document.createElement('h3');
        park_name.innerHTML = result.data[0].fullName;
        state_park.append(park_name);

        // Teacher's Guide: https://www.nps.gov/${parkCode}/learn/education/teachersguide.htm
        const teacher_guide = document.createElement('h4');
        const teacher_guide_link = document.createElement('a');
        teacher_guide_link.setAttribute('href', `https://www.nps.gov/${park_code}/learn/education/teachersguide.htm`);
        teacher_guide_link.innerHTML = 'Teacher\s Guide';
        teacher_guide.append(teacher_guide_link);
        state_park.append(teacher_guide);


            // Access lesson plans for the specified park
            fetch(`https://developer.nps.gov/api/v1/lessonplans?parkCode=${park_code}&api_key=${api_key}`)
            .then(response => {
            // console.log('Response:', response)
            return response.json();
            })
            .then(result => {
                console.log('Result:', result);

                for (data in result.data) {
                    const lesson_title = document.createElement('h5');
                    const lesson_link = document.createElement('a');
                    lesson_link.innerHTML = result.data[data].title;
                    lesson_link.setAttribute('href', result.data[data].url);
                    lesson_title.append(lesson_link);
                    state_park.append(lesson_title);

                }
            })
            .catch(error => {
                console.log('Error', error);
            });


        })
        .catch(error => {
            console.log('Error', error);
        });

        
        

}