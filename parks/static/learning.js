document.addEventListener('DOMContentLoaded', function() {

    // Hide the state-parks, park-lessons, np-lessons, saved-lessons, and edit-lesson divs.
    document.getElementById('state-parks').style.display = 'none';
    document.getElementById('park-learning').style.display = 'none';
    document.getElementById('np-lessons').style.display = 'none';
    document.getElementById('saved-lessons').style.display = 'none';
    document.getElementById('edit-lesson').style.display = 'none';
    
    const select = document.querySelector('select');

    select.addEventListener('change', () => {
        const state = select.value;
        // console.log('State:', state)

        get_parks(state);
    });

    const saved = document.querySelector('#saved');
    if (saved !== null) {
        saved.addEventListener('click', () => {
            // If a stored-lesson-data and the edit-form already exist and the user selects a new lesson to edit, the user should not see two lessons to edit.
            // Check if edit_form has a CSS rule display:block. If so remove the element.
            // https://stackoverflow.com/questions/4866229/check-element-css-display-with-javascript
            const edit_lesson = document.querySelector('#edit-lesson');
            console.log(edit_lesson);
            
            if (edit_lesson.style.display === 'block') {
                // Removing a div clears the page and does not display new results.
                // Hide all child nodes of edit-lesson (stored-lesson-data and edit-form)
                // edit_lesson.style.display = 'none';
                // Refresh the page
                // this.location.reload();                
                // get_saved_lessons();
            } else {
            // 
            }
            get_saved_lessons();
        });
    }       

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
        // Display state-parks div.
        document.getElementById('state-parks').style.display = 'block';

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
            park_link.addEventListener('click', get_park_links.bind(null, park_code, full_park_name)); // get_park(park_code) immediately invokes the get_park function.
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


const get_park_links = (park_code, full_park_name) => {
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

        // Hide the state-parks div.
        document.getElementById('state-parks').style.display = 'none';
        // Display the park-lessons div.
        const park_learning = document.getElementById('park-learning');     
        park_learning.style.display = 'block';

        const park_name = document.createElement('h3');
        park_name.innerHTML = result.data[0].fullName;
        park_learning.append(park_name);

        // Learn About the Park: https://www.nps.gov/${parkCode}/learn/index.htm
        const learn = document.createElement('h4');
        const learn_link = document.createElement('a');
        learn_link.setAttribute('href', `https://www.nps.gov/${park_code}/learn/index.htm`);
        learn_link.innerHTML = 'Learn About the Park';
        learn.append(learn_link);
        park_learning.append(learn);

        const k12_education = document.createElement('h4');
        k12_education.innerHTML = 'For Parents and K-12 Educators';
        park_learning.append(k12_education);

        const teacher_guide = document.createElement('h4');
        const teacher_guide_link = document.createElement('a');
        teacher_guide_link.setAttribute('href', `https://www.nps.gov/${park_code}/learn/education/teachersguide.htm`);
        teacher_guide_link.innerHTML = 'Teacher\s Guide';
        teacher_guide.append(teacher_guide_link);
        park_learning.append(teacher_guide);

        const trips = document.createElement('h4');
        const trips_link = document.createElement('a');
        trips_link.setAttribute('href', `https://www.nps.gov/${park_code}/learn/education/classrooms/fieldtrips.htm`);
        trips_link.innerHTML = 'Field Trips';
        trips.append(trips_link);
        park_learning.append(trips);

        const trunks = document.createElement('h4');
        const trunks_link = document.createElement('a');
        trunks_link.setAttribute('href', `https://www.nps.gov/${park_code}/learn/education/travellingtrunks.htm`);
        trunks_link.innerHTML = 'Traveling Trunks';
        trunks.append(trunks_link);
        park_learning.append(trunks);

        get_park_lessons(park_code, full_park_name);

    })
    .catch(error => {
        console.log('Error', error);
    });        

}


const get_park_lessons = (park_code, full_park_name) => {

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
        document.getElementById('park-learning').style.display = 'block';
        document.getElementById('np-lessons').style.display = 'block';
       
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

                    const lesson_id = document.createElement('p');
                    lesson_id.innerHTML = `Lesson ID: ${result.data[data].id}`;
                    lesson_div.append(lesson_id);

                    const id = result.data[data].id;
                    
                    const save = document.createElement('button');
                    save.innerHTML = 'Save';
                    save.setAttribute('class', 'save');
                    save.setAttribute('data-lessonid', id);
                    lesson_div.append(save);
                                
                    np_lessons.append(lesson_div);

                } else {

                    p.innerHTML = 'There are no lessons or no more lessons available for this park at this time.';
                    np_lessons.append(p);                        
                
                }  
            }   
        }
        
        const save = document.querySelectorAll('.save');
        save.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                // https://stackoverflow.com/questions/34896106/attach-event-to-dynamic-elements-in-javascript 
                const target = e.target.closest('.save');
                console.log('Target:', target);

                const lesson_id = target.dataset.lessonid;

                save_a_lesson(park_code, lesson_id);                

            })
        });        

    });
}


const save_a_lesson = (park_code, lesson_id) => {

    const api_key = NP_API_KEY.value;           

    console.log('Saving Park Code:', park_code);
    // Connect save button with the specific lesson the user wants to save using the parkCode and lessonId.
    // Fetch the lesson data and store it in variables to pass to the database.
    fetch(`https://developer.nps.gov/api/v1/lessonplans?parkCode=${park_code}&api_key=${api_key}`)
    .then(response => {
        return response.json();
    })
    .then(result => {
        // console.log('Result:', result);

        lessons = result.data;
        // console.log(result.data);
        // From the array of lesson returned for the parkCode, identify the specific lesson with the lessonId.
        lessons.forEach((lesson) => {

            // console.log('Choose Lesson to Save:', lesson);            
            
            // Get this button when the event listener is triggered and pass it to this function 
            console.log('LessonID:', lesson_id);       
            // console.log('LessonID from endpoint:', lesson.id);

            if (lesson_id === lesson.id) {
                console.log('Lesson to Save:', lesson); // If 2 lessons are available, the program lists the lesson twice in the console.
                // Store lesson data in the following variables.
                const id = lesson.id;
                // console.log('ID:', id);
                const url = lesson.url;
                // console.log('URL:', url);
                const title = lesson.title;
                // console.log('Title:', title);
                const parks = lesson.parks;
                // console.log('Parks:', parks);
                const questionObjective = lesson.questionObjective;
                // console.log('Question Objective:', questionObjective);
                const gradeLevel = lesson.gradeLevel;
                // console.log('Grade Level:', gradeLevel);
                const commonCore = lesson.commonCore;
                // console.log('Common Core:', commonCore);
                const subject = lesson.subject;
                // console.log('Subject:', subject);
                const duration = lesson.duration;
                // console.log('Duration:', duration);
                // const notes = lesson.notes;
                // console.log('Notes:', notes);
                // const image = lesson.image;
                // console.log('Image:', image);
                // const doc_upload = lesson.doc_upload;
                // console.log('Doc Upload:', doc_upload);
                // const user = lesson.user;
                // console.log('User:', user);

                // Fetch error in python - Forbidden (CSRF token missing.): /save_park_lesson
                // To fetch from JS you must include the CSRF token.
                // https://stackoverflow.com/questions/6506897/csrf-token-missing-or-incorrect-while-post-parameter-via-ajax-in-django
                // https://docs.djangoproject.com/en/5.0/howto/csrf/

                function getCookie(name) {
                    let cookieValue = null;
                    if (document.cookie && document.cookie !== '') {
                        const cookies = document.cookie.split(';');
                        for (let i = 0; i < cookies.length; i++) {
                            const cookie = cookies[i].trim();
                            // Does this cookie string begin with the name we want?
                            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                break;
                            }
                        }
                    }
                    return cookieValue;
                }

                const current_user = document.getElementById('current-user').value;
                // console.log('Current User:', current_user);

                if (current_user === 'AnonymousUser') {
                    // If user is not authenticated, send a message to sign in.
                    // Create alert with message()
                    // console.log('Please sign in to save a lesson');
                    // <div class="alert alert-warning" role="alert">'Please sign in to save a lesson'</div>
                    const login_message = document.getElementById('login-message');
                    login_message.innerHTML = 'Please sign in to save a lesson';
                    login_message.setAttribute('class', 'alert alert-warning');
                    login_message.setAttribute('role', 'alert');

                    // Go to the top of the page automatically.
                    // https://stackoverflow.com/questions/4210798/how-to-scroll-to-top-of-page-with-javascript-jquery
                    document.body.scrollTop = document.documentElement.scrollTop = 0;

                } else {

                    // Send a POST request to the /save_park_lesson route with the values captured above.
                    fetch('save_park_lesson', {
                        method: 'POST',
                        headers: {'X-CSRFToken': getCookie('csrftoken')},
                        body: JSON.stringify({
                            id: id,
                            url: url,
                            title: title,
                            parks: parks,
                            questionObjective: questionObjective,
                            gradeLevel: gradeLevel,
                            commonCore: commonCore,
                            subject: subject,
                            duration: duration
                        })
                    })
                    .then(response => response.json())
                    .then(result => {
                        console.log('Result:', result);
                        // Once the data has been saved, send a message to the user.
                        const saved_message = document.getElementById('saved-message');
                        saved_message.innerHTML = 'Please sign in to save a lesson';
                        saved_message.setAttribute('class', 'alert alert-success');
                        saved_message.setAttribute('role', 'alert');
                        saved_message.innerHTML = 'Lesson saved successfully';
                        // Go to the top of the page automatically.
                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                        // Show to saved lessons

                    })
                    .catch((error) => {
                        console.log('Error:', error);
                    });
                }

            }

        });

    });
    
}


const get_saved_lessons = () => {
    // Make a GET request to /saved route to request all specified user's saved lessons.
    fetch('saved')
    .then(response => response.json())
    .then(result => {
        console.log('Result:', result)

        // Display results for the user in the saved-lessons div.
        const saved_lessons = document.getElementById('saved-lessons');
        saved_lessons.style.display = 'block';

        // Hide all other divs
        document.getElementById('search-by-state').style.display = 'none';
        document.getElementById('state-parks').style.display = 'none';
        document.getElementById('park-learning').style.display = 'none';
        document.getElementById('np-lessons').style.display = 'none';
        document.getElementById('edit-lesson').style.display = 'none';

        const saved_heading = document.createElement('h2');
        saved_heading.innerHTML = `Saved Lessons`;
        saved_lessons.append(saved_heading);
        const hr = document.createElement('hr');
        saved_lessons.append(hr);

        for (lesson in result) {
            // console.log('Lesson:', result[lesson]);
            
            const lesson_id = result[lesson].id;
            // console.log('Lesson ID:', lesson_id);

            const lesson_div = document.createElement('div');
            lesson_div.setAttribute('class', 'lessons');
            const lesson_title = document.createElement('p');
            lesson_title.setAttribute('class', 'lesson-title');
            lesson_title_link = document.createElement('a');
            lesson_title_link.innerHTML = result[lesson].title;
            lesson_title_link.setAttribute('href', '#'); 
            lesson_title_link.addEventListener('click', get_lesson.bind(null, lesson_id));
            lesson_title.append(lesson_title_link);
            lesson_div.append(lesson_title);
            const lesson_question = document.createElement('p');
            lesson_question.innerHTML = `Lesson Objective: ${result[lesson].questionObjective}`;
            lesson_div.append(lesson_question);
            const edit_button = document.createElement('button');            
            edit_button.innerHTML = 'Edit';
            edit_button.setAttribute('class', 'edit');
            lesson_div.append(edit_button);

            saved_lessons.append(lesson_div);

            edit_button.addEventListener('click', get_lesson.bind(null, lesson_id));
        }
    });
}

/*
const edit_a_lesson = (lesson_id) => {

    console.log('Edit a Lesson Function:', lesson_id);

    // Pass lesson_id to the edit form action attribute in index.html.
    // const id = lesson_id;
    
    const edit_lesson = document.getElementById('edit-lesson');
    edit_lesson.style.display = 'block';

    // Hide saved-lessons divs
    document.getElementById('saved-lessons').style.display = 'none';

    // Display form with saved lesson for the user to edit.
    edit_lesson(lesson_id);

    /*
        "id": self.id,
            "url": self.url,
            "title": self.title,
            "parks": self.parks,
            "questionObjective": self.questionObjective,
            "gradeLevel": self.gradeLevel,
            "commonCore": self.commonCore,
            "subject": self.subject,
            "duration": self.duration,
            "notes": self.notes,
            "image": json.dumps(str(self.image)), # use self.image.path-to-image when I have it
            "doc_upload": json.dumps(str(self.doc_upload)), # use self.doc_upload.path-to-doc when I have it
            "user": json.dumps(str(self.user)), 
            "date": self.date.strftime("%b %d %Y, %I:%M %p")
*/
//}



const get_lesson = (lesson_id) => {
    console.log('Lesson ID:', lesson_id);

    // Make a GET request to /get_lesson_to_edit route to request the lesson specified by the user.
    fetch(`get_lesson_to_edit/${lesson_id}`)
    .then(response => response.json())
    .then(result => {
        console.log('Result:', result)

        // Display results for the user in the stored-lesson-data div.
        const stored_lesson_data = document.getElementById('stored-lesson-data');
        stored_lesson_data.style.display = 'block';

        // Hide all other divs
        document.getElementById('saved-lessons').style.display = 'none';
        // document.getElementById('state-parks').style.display = 'none';
        // document.getElementById('park-learning').style.display = 'none';
        // document.getElementById('np-lessons').style.display = 'none';
        // document.getElementById('edit-lesson').style.display = 'none';
       
        const title = document.createElement('p');
        title.innerHTML = `Title: ${result.title} : ${result.id}`;
        stored_lesson_data.append(title);
        const url = document.createElement('p');
        url.innerHTML = `Link: ${result.url}`;
        stored_lesson_data.append(url);
        const objective = document.createElement('p');
        objective.innerHTML = `Objective: ${result.objective}`;
        stored_lesson_data.append(objective);
        const grade = document.createElement('p');
        grade.innerHTML = `Grade Level: ${result.grade}`;
        stored_lesson_data.append(grade);
        const standards = document.createElement('ul');
        for (i in result.commonCore) {
            const standards_li = document.createElement('li');
            standards_li.innerHTML = `Standards: ${result.commonCore[i]}`;
            standards.append(standards_li); 
            stored_lesson_data.append(standards);           
        }

        const subject = document.createElement('ul');
        for (i in result.subject) {
            const subject_li = document.createElement('li');
            subject_li.innerHTML = `Subject: ${result.subject[i]}`;
            subject.append(subject_li); 
            stored_lesson_data.append(subject);           
        }

        const duration = document.createElement('p');
        duration.innerHTML = `Duration: ${result.duration}`;
        stored_lesson_data.append(duration);  
        
        // Display form to edit lesson plan in the edit-lesson div.
        const edit_lesson = document.getElementById('edit-lesson');
        edit_lesson.style.display = 'block';

        const edit_url = `/edit/${lesson_id}`;
        const edit_form = document.querySelector('#edit-form');
        edit_form.setAttribute('action', edit_url)

        const notes_label = document.createElement('label');
        notes_label.setAttribute('for', 'notes');
        notes_label.setAttribute('class', 'form-label');
        notes_label.innerHTML = 'Lesson Notes';
        edit_form.append(notes_label);

        const notes = document.createElement('textarea');
        notes.setAttribute('id', 'notes');
        notes.setAttribute('class', 'form-control');
        notes.setAttribute('placeholder', 'Add Lesson Notes Here');
        edit_form.append(notes);

        const image_label = document.createElement('label');
        image_label.setAttribute('for', 'image-upload');
        image_label.setAttribute('class', 'form-label');
        image_label.innerHTML = 'Upload an Image';
        edit_form.append(image_label);

        const image = document.createElement('input');
        image.setAttribute('type', 'file');
        image.setAttribute('id', 'image-upload');
        image.setAttribute('name', 'image');
        image.setAttribute('multiple', '');
        image.setAttribute('accept', '.png,.jpeg,.jpg,.bmp');
        edit_form.append(image);

        const doc_file_label = document.createElement('label');
        doc_file_label.setAttribute('for', 'doc-file');
        doc_file_label.setAttribute('class', 'form-label');
        doc_file_label.innerHTML = 'Upload a Document';
        edit_form.append(doc_file_label);

        const doc_file = document.createElement('input');
        doc_file.setAttribute('type', 'file');
        doc_file.setAttribute('id', 'doc-file');
        doc_file.setAttribute('name', 'doc-file');
        doc_file.setAttribute('multiple', '');
        doc_file.setAttribute('accept', '.doc,.docx,.pdf');
        edit_form.append(doc_file);

        const save_button = document.createElement('button');
        save_button.setAttribute('type', 'submit');
        save_button.setAttribute('id', 'save-edit');
        save_button.setAttribute('class', 'btn btn-success');
        save_button.innerHTML = 'Save';
        edit_form.append(save_button);             
        
        // Add event listener to Save button.
        // save_button.addEventListener('click', edit_lesson.bind(null, lesson_id));

        // document.getElementById('save-edit').addEventListener('click', (e) => {
        //     e.preventDefault(); // Prevent form submission

        //     // Store user input/edit form field values in the following variables.
        //     const edit_notes = document.querySelector('#notes').value;
        //     const edit_image = document.querySelector('#image-upload').value;
        //     const edit_doc_file = document.querySelector('#doc-file').value;
            
        //     edit_lesson(lesson_id, edit_notes, edit_image, edit_doc_file);
        // });
        
    });

    /*
    // Add event listener to Save button.
    const save_edit = document.querySelector('#save-edit');
    if (save_edit !== null) {
        save_edit.addEventListener('click', edit_lesson.bind(null, lesson_id));      
    }
    */
}

/*
// Edit a specific lesson
const edit_lesson = (lesson_id) => {

    // Store user input/edit form field values in the following variables.
    const edit_notes = document.querySelector('#notes').value;
    const edit_image = document.querySelector('#image-upload').value;
    const edit_doc_file = document.querySelector('#doc-file').value;

    console.log('Edit ID saved:', lesson_id);
    console.log('Edit Notes Saved:', edit_notes);
    console.log('Edit Image Saved:', edit_image);
    console.log('Edit DocFile Saved:', edit_doc_file);

    // Send a POST request to the /edit route with the values captured above.
    fetch('edit', {
        method: 'POST',
        body: JSON.stringify({
            id: lesson_id,
            notes: edit_notes,
            image: edit_image,
            doc_upload: edit_doc_file
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log('Result', result);
        // Show saved lessons
        get_saved_lessons();
    })
    .catch((error) => {
        console.log('Error:', error);
    });
}
*/