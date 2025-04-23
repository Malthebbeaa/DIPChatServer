import fs from 'fs/promises';
import express from 'express';
import session from 'express-session';
import { json, urlencoded } from 'body-parser';

const app = express();

//middleware
app.set('view engine', 'pug');
app.use(express.static('assets'));
app.use(session({
    secret: 'DC732C06-B5BA-4B1A-AB1F-88C827772B01',
    saveUninitialized: true,
    resave: true
}));
app.use(express.json());
app.use(urlencoded({extended: true}));
