import './index.css'
import 'flowbite'
import {z} from 'zod'

//Validation (frontend) rules in place.
export function contactForm() {
    const schema = z.object({
        name: z
            .string({required_error: 'Name is a required field'})
            .max(64, {message: 'Name cannot be greater than 64 characters'}),
        email: z
            .string({required_error: 'Email is a required field'})
            .email({message: 'Invalid email address'})
            .max(128, {message: 'Email cannot be greater than 128 characters'}),
        subject: z
            .string({})
            .max(64, {message: 'Subject cannot be greater than 80 characters'})
            .optional(),
        message: z
            .string({required_error: 'Message is a required field'})
            .max(500, {message: 'Message cannot be greater than 500 characters'})
    })

//Grab form to convert it into a form-data object and add event listeners
    const form = document.getElementById('contact-form')

//grab the required input fields so that we can add/remove a red border if an error occers
    const nameInput = document.getElementById('user-name')
    const emailInput = document.getElementById('user-email')
    const messageInput = document.getElementById('user-message')

//grab the error display elements to display error messages
    const nameError = document.getElementById('nameError')
    const emailError = document.getElementById('emailError')
    const messageError = document.getElementById('messageError')

//grab the status output element to show a success message on a successful submit or a backend error message
    const statusOutput = document.getElementById('status')

//define success and error classes to give user a quick visual hint on if the request was successful or not
    const successClasses = ['text-green-800', 'bg-green-50']
    const errorClasses = ['text-red-800', 'bg-red-50']

}
