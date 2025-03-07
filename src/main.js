import './index.css'
import 'flowbite'
import {z} from 'zod'

//Validation (frontend) rules in place.
export function contactForm() {
    const schema = z.object({})
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
            .optional()
        message: z
            .string(required_error: 'Message is a required field')
            .max(500, {message: 'Message cannot be greater than 500 characters'})

}
