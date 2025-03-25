import express, { request, response } from 'express'
import morgan from 'morgan';
import { z } from 'zod'
import formData from 'form-data'
import Mailgun from 'mailgun.js'
import 'dotenv/config'
import cors from 'cors'

const mailgun = new Mailgun(formData)
const mailgunClient = mailgun.client({username:'api', key:process.env.MAILGUN_API_KEY})



// setup up and configured our middleware
const app = express()

//registered Morgan as a middleware with express
// middleware allows for modifying incoming requests and customizing our responses
app.use(morgan('dev'))

// setup express to use json responses and parse json requests
app.use(express.json())

//remove for production
app.use(cors())

// Created a router so that we can have custom paths for different resources in our application
const indexRoute = express.Router()

const firstHandler = async (request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    const schema = z.object({
        'user-name': z
            .string({ required_error: 'Name is a required field' })
            .min(1, {message: 'Name is a required field'})
            .max(64, { message: 'Name cannot be greater than 64 characters' }),
        'user-email': z
            .string({ required_error: 'Email is a required field' })
            .min(1, {message: 'Email is a required field'})
            .email({ message: 'Invalid email address' })
            .max(128, { message: 'Email cannot be greater than 128 characters' }),
        'user-message': z
            .string({ required_error: 'Message is a  required field' })
            .min(1, {message: 'Message is a  required field' })
            .max(500, { message: 'Message cannot be greater than 500 characters' })
    })

    const result = schema.safeParse(request.body)

    if(result.error) {
        return response.json({status:418, message: result.error.issues[0].message})
    }

    if(request.body.website !== "") {
        return response.json({status:201, message: 'Email sent successfully'})
    }

    try{

        const mailgunMessage = {
            from: `${result.data['user-name']} <postmaster@${process.env.MAILGUN_DOMAIN}>`,
            subject: 'Message from personal website',
            text: `
      from ${result.data["user-email"]}
      
      ${result.data["user-message"]}`,
            to: process.env.MAILGUN_RECIPIENT
        }

        await mailgunClient.messages.create(process.env.MAILGUN_DOMAIN, mailgunMessage)
        return response.json({status:200, message: "Email sent successfully"})

    } catch (error) {
        console.error(error)
        return response.json({status:500, message: 'Internal server error, try again later.'})

    }




}

indexRoute.route('/').post(firstHandler)

app.use('/apis', indexRoute)

// app.listen tells express what port to run on
app.listen(4200, () => {
    console.log('server is running')
})