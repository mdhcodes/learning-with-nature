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
        const section = document.createElement('section'); 
        const location = document.createElement('h1'); 
        location.innerHTML = `${state_name} - ${result.total} National Parks`;
        section.append(location);
        const hr = document.createElement('hr');
        section.append(hr);

        console.log('Data:', result.data)

        for (data in result.data) {                                         
            const div = document.createElement('div'); 
            const park_designation = document.createElement('p');
            park_designation.innerHTML = result.data[data].designation;
            div.append(park_designation);
            const park_name = document.createElement('h3');
            // park_name.setAttribute('class', 'park-name');
            const park_link = document.createElement('a');
            park_link.innerHTML = result.data[data].name; 
            park_link.setAttribute('href', '#'); // The park_link event listener contains the endpoint to fetch when clicked.
            const park_code = result.data[data].parkCode;
            const full_park_name = result.data[data].fullName;
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind
            // bind() will pass the variable park_code without invoking the get_park function.
            park_link.addEventListener('click', park_learning.bind(null, park_code, full_park_name)); // get_park(park_code) immediately invokes the get_park function.
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
            div.setAttribute('class', 'parks');
            section.append(div);
            // const hr = document.createElement('hr');
            // div.append(hr);
            // park_image = document.createElement('img');
            // park_image.setAttribute('src', result.data[data].images[0].url)
            // park_image.setAttribute('alt', result.data[data].images[0].altText)   
            // div.append(park_image);
        }
       
        state_parks.append(section);
                
    })
    .catch(error => {
        console.log('Error:', error)
    });

}


const park_learning = (park_code, full_park_name) => {
    console.log('Park Code:', park_code);
    console.log('Full Park Name:', full_park_name);

    const api_key = NP_API_KEY.value;

    
    // Send a GET request to the National Parks Service with the park_code value.
    fetch(`https://developer.nps.gov/api/v1/parks?parkCode=${park_code}&api_key=${api_key}`)
    .then(response => {
        // console.log('Response:', response)
        return response.json();
    })
    .then(result => {
        console.log('Result:', result)
        const park_lessons = document.getElementById('park-lessons');

        // Hide the search-by-state and state-parks divs.
        document.getElementById('search-by-state').style.display = 'none';
        document.getElementById('state-parks').style.display = 'none';
        document.getElementById('np-lessons').style.display = 'none';

        // Display the state-park div
        park_lessons.style.display = 'block';

        const park_name = document.createElement('h3');
        park_name.innerHTML = result.data[0].fullName;
        park_lessons.append(park_name);

        // Learn About the Park: https://www.nps.gov/${parkCode}/learn/index.htm
        const learn = document.createElement('h4');
        const learn_link = document.createElement('a');
        learn_link.setAttribute('href', `https://www.nps.gov/${park_code}/learn/index.htm`);
        learn_link.innerHTML = 'Learn About the Park';
        learn.append(learn_link);
        park_lessons.append(learn);

        const k12_education = document.createElement('h4');
        k12_education.innerHTML = 'For Parents and K-12 Educators';
        park_lessons.append(k12_education);

        const teacher_guide = document.createElement('h4');
        const teacher_guide_link = document.createElement('a');
        teacher_guide_link.setAttribute('href', `https://www.nps.gov/${park_code}/learn/education/teachersguide.htm`);
        teacher_guide_link.innerHTML = 'Teacher\s Guide';
        teacher_guide.append(teacher_guide_link);
        park_lessons.append(teacher_guide);

        const trips = document.createElement('h4');
        const trips_link = document.createElement('a');
        trips_link.setAttribute('href', `https://www.nps.gov/${park_code}/learn/education/classrooms/fieldtrips.htm`);
        trips_link.innerHTML = 'Field Trips';
        trips.append(trips_link);
        park_lessons.append(trips);

        const trunks = document.createElement('h4');
        const trunks_link = document.createElement('a');
        trunks_link.setAttribute('href', `https://www.nps.gov/${park_code}/learn/education/travellingtrunks.htm`);
        trunks_link.innerHTML = 'Traveling Trunks';
        trunks.append(trunks_link);
        park_lessons.append(trunks);

        get_all_lessons(park_code, full_park_name);

    })
    .catch(error => {
        console.log('Error', error);
    });        

}


const get_all_lessons = (park_code, full_park_name) => {

    const api_key = NP_API_KEY.value;

    // Send a GET request to the National Parks Service for all lesson plans.
    fetch(`https://developer.nps.gov/api/v1/lessonplans?limit=1270&api_key=${api_key}`) // total number of lessons: 1270
    .then(response => {
        console.log('Response:', response)
        return response.json();
    })
    .then(result => {
        console.log('Result:', result)

        // Display the following divs
        document.getElementById('park-lessons').style.display = 'block';
        document.getElementById('np-lessons').style.display = 'block';

        // Hide the search-by-state and state-parks divs.
        document.getElementById('search-by-state').style.display = 'none';
        document.getElementById('state-parks').style.display = 'none';
       
        const np_lessons = document.getElementById('np-lessons');

        const h3 = document.createElement('h3');
        h3.innerHTML = `${full_park_name} Lesson Plans`;
        np_lessons.append(h3);
        const hr = document.createElement('hr');
        np_lessons.append(hr);

        const p = document.createElement('p');

        for (data in result.data) {

            for (park in result.data[data].parks) {

            // console.log('All Lessons:', result.data[data].parks);
            
                if (park_code === result.data[data].parks[park] && result.data[data].parks.length > 0) {

                    const lesson_div = document.createElement('div');
                    lesson_div.setAttribute('class', 'lessons');
                    const lesson_title = document.createElement('h3');
                    const lesson_link = document.createElement('a');
                    lesson_link.innerHTML = result.data[data].title;
                    lesson_link.setAttribute('href', result.data[data].url);
                    lesson_title.append(lesson_link);
                    lesson_div.append(lesson_title);

                    const common_core = document.createElement('ul');
                    const common_core_li_1 = document.createElement('li');
                    const common_core_li_2 = document.createElement('li');
                    const common_core_li_3 = document.createElement('li');
                    const common_core_li_4 = document.createElement('li');
                    for (standard in result.data[data].commonCore) {                
                        common_core_li_1.innerHTML = `State Standards: ${result.data[data].commonCore.stateStandards}`;
                        common_core.append(common_core_li_1);             
                        common_core_li_2.innerHTML = `ELA Standards: ${result.data[data].commonCore.elaStandards}`;      
                        common_core.append(common_core_li_2);                
                        common_core_li_3.innerHTML = `Math Standards: ${result.data[data].commonCore.mathStandards}`;
                        common_core.append(common_core_li_3);             
                        common_core_li_4.innerHTML = `Additional Standards: ${result.data[data].commonCore.additionalStandards}`;
                        common_core.append(common_core_li_4);             
                        lesson_div.append(common_core);
                    }
                    
                    const duration = document.createElement('p');
                    duration.innerHTML = `Lesson Duration: ${result.data[data].duration}`;
                    lesson_div.append(duration);

                    const grade_level = document.createElement('p');
                    grade_level.innerHTML = `Grade Level: ${result.data[data].gradeLevel}`;
                    lesson_div.append(grade_level);

                    const lesson_objective = document.createElement('p');
                    lesson_objective.innerHTML = `Objective: ${result.data[data].questionObjective}`;
                    lesson_div.append(lesson_objective);

                    const lesson_subject = document.createElement('ul');
                    for (subject in result.data[data].subject) {
                        const lesson_subject_li = document.createElement('li');
                        lesson_subject_li.innerHTML = `Subject: ${result.data[data].subject[subject]}`;
                        lesson_subject.append(lesson_subject_li);
                        lesson_div.append(lesson_subject);
                    }
                                
                    np_lessons.append(lesson_div);

                } else {

                    p.innerHTML = 'There are no lessons available at this time.';
                    np_lessons.append(p);                        
                
                }                    
                
            }   
        }

    });
}