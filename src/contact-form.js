import {z} from 'zod'

//Validation (frontend) rules in place.
export function contactForm() {
    const schema = z.object({
        "user-name": z
            .string({required_error: 'Name is a required field'})
            .min (1, {message: 'Name is a required field'})
            .max(64, {message: 'Name cannot be greater than 64 characters'}),
        "user-email": z
            .string({required_error: 'Email is a required field'})
            .min (1, {message: 'Email is a required field'})
            .email({message: 'Invalid email address'})
            .max(128, {message: 'Email cannot be greater than 128 characters'}),
        "user-message": z
            .string({required_error: 'Message is a required field'})
            .min (1, {message: 'message is a required field'})
            .max(500, {message: 'Message cannot be greater than 500 characters'})
    })

//Grab form to convert it into a form-data object and add event listeners
    const form = document.getElementById('contact-form')

//grab the required input fields so that we can add/remove a red border if an error occurs
    const nameInput = document.getElementById('user-name')
    const emailInput = document.getElementById('user-email')
    const messageInput = document.getElementById('user-message')
    console.log(nameInput)
//grab the error display elements to display error messages
    const userNameError = document.getElementById('userNameError')
    const emailError = document.getElementById('userEmailError')
    const messageError = document.getElementById('userMessageError')

//grab the status output element to show a success message on a successful submit or a backend error message
    const statusOutput = document.getElementById('status')

//define success and error  tailwind classes to give user a quick visual hint on if the request was successful or not
    const successClasses = ['text-green-800', 'bg-green-50']
    const errorClasses = ['text-red-800', 'bg-red-50']

//Define event listeners for what happens on submit;
    form.addEventListener('submit', (event) => {
        //Preventing default browser behavior, customizing behavior
        event.preventDefault()

//Create an object from the form using form data
        const formData = new FormData(form)

//hide error messages and remove styling from previous submissions using array prototype
        const errorArray = [userNameError, userEmailError, userMessageError]
        errorArray.forEach(element => {element.classList.add('hidden')})

        const inputArray =  [nameInput, emailInput, messageInput]
        inputArray.forEach(input => {input.classList.remove('border-red-500')})

//Honey Pot handling - gives bots fake sense of success & clears out form
//if the website input is set a bot most likely filled out the form, so provide a fake success message to trick the bot into thinking it succeeded
        if(formData.get('website') !== '') {
            form.reset()
            statusOutput.innerHTML = 'Message sent successfully'
            statusOutput.add(...successClasses)
            statusOutput.remove('hidden')
            return
        }

//Convert formData into an object so that validation can be performed
        const values = Object.fromEntries(formData.entries())

//if email is an empty string set it to undefined
        values.email = values.email === '' ? undefined : values.email
        console.log(values)
//check for zod errors related to validating inputs and provide feedback to users if an error occurred
        const result = schema.safeParse(values)
        if(result.success === false ) {
            const errorsMap =  {
                name: {inputError: nameInput, errorElement: userNameError},
                email: {inputError: emailInput, errorElement: userEmailError},
                message: {inputError: messageInput, errorElement: userMessageError},
            }
            result.error.errors.forEach(error => {
                const {errorElement, inputError} = errorsMap[error.path[0]]
                errorElement.innerHTML = error.message
                errorElement.classList.remove('hidden')
                inputError.classList.add('border-red-500')
            })
            return
        }
    //if everything is valid submit the form
        fetch('http://localhost:4200/apis', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify(values)
        }).then(response => response.json())
            .then(data => {
                statusOutput.innerHTML = data.message

                if (data.status === 200) {
                    statusOutput.classList.add(...successClasses)
                    form.reset()
                } else {
                    statusOutput.classList.add(...errorClasses)
                }

                statusOutput.classList.remove('hidden')
            }).catch(error => {
                console.error(error)
            statusOutput.innerHTML  = 'Internal server error try again later'
            statusOutput.classList.add(...errorClasses)
            statusOutput.classList.remove('hidden')
        })

        console.log('form_validated_successfully', result.data)
    })

}