'use strict';


require('dotenv').config();

//dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');


//PORT
const PORT = process.env.PORT || 3000;

//the App
const app = express();

//

//
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

//
app.set('view engine', 'ejs');

const client = new pg.Client(process.env.DATABASE_URL);
/////////////////calling routs\\\\\\\\\\\\\
app.get('/', booksInDataBase);
app.get('/books/:bookId', forDetails);
app.get('/new', searchForAbook);
app.post('/books', selectBook);
app.post('/searches', resultsOfSearch);
app.delete('/delete/:deleteId',deleteBook);
app.put('/update/:updateId',updateTheBook);


function booksInDataBase(req, res) {
    // console.log('hi')
    let SQL = 'SELECT * FROM books;';
    // console.log(SQL)
    return client.query(SQL)
        .then(results => {

            // console.log(results.rows)
            res.render('pages/index', { dataBaseBooks: results.rows });
        })
}

//test route
function forDetails(request, response) {
    // console.log(request.params.bookId);
    let SQL = 'SELECT * FROM books WHERE id=$1;';
    let Svalue = [request.params.bookId]
    return client.query(SQL, Svalue)
        .then((results) => {
            response.render('./pages/books/show', { details: results.rows[0] });

        })
}

//search route
function searchForAbook(request, response) {
    response.render('pages/searches/new');
}

//results of search route
function resultsOfSearch(request, response) {
    let url;
    let whatInTheSearch = request.body.search;
    let radioChoose = request.body.type;
    // console.log('jasdhjhdadhal', request.query);
    // console.log('hdajhdaaaaaaaaaaa', whatInTheSearch);
    if (radioChoose === 'title') {
        url = `https://www.googleapis.com/books/v1/volumes?q=${whatInTheSearch}`;
    }
    else {
        url = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${whatInTheSearch}`
        console.log('author')
    };

    // console.log(url)
    superagent.get(url)
        .then(data => {
            // console.log(data.body.items[0].volumeInfo.imageLinks.thumbnail)
            let theBooks = data.body.items.map(oneBook => {
                let newBook = new Books(oneBook)


                return newBook
            })
            // console.log(theBooks);


            response.render('pages/searches/show', { book: theBooks });
        })
}
function selectBook(req, res) {
    console.log(req.body);
    let { authors, title, isbn, image, description, bookshelf } = req.body;
    let SQL = 'INSERT INTO books (author,title,isbn,image_url,description,bookshelf) VALUES ($1,$2,$3,$4,$5,$6);';
    let saveValues = [authors, title, isbn, image, description, bookshelf];
    client.query(SQL, saveValues)
    .then(() => {
        res.redirect('/')
    })
}
////////////////delete book\\\\\\\\\\\\\\\\\\
function deleteBook(req,res){
    // console.log(req.body.deleteId)//////will not work because you need to pick it from params Not body
    let SQL = 'DELETE FROM books WHERE id=$1;';
    let deleteValue = [req.params.deleteId];
    client.query(SQL,deleteValue)
    .then(()=>{
        res.redirect('/')
    })
    

}
///////////////////update book\\\\\\\\\\\\\\\\\\\\\
function updateTheBook(req,res){
    let { authors, title, isbn, image, description, bookshelf } = req.body;
    let SQL = 'UPDATE books SET author=$1,title=$2,isbn=$3,image_url=$4,description=$5,bookshelf=$6 WHERE id=$7;';
    let saveValues = [authors, title, isbn, image, description, bookshelf ,req.params.updateId];
    
    client.query(SQL,saveValues)
    .then(()=>{
        res.redirect(`/books/${req.params.updateId}`)
    })
}




function Books(data) {
    this.authors = (data.volumeInfo.authors[0] && data.volumeInfo.authors[0]) || 'there is no name';
    this.title = data.volumeInfo.title;
    this.isbn = (data.volumeInfo.industryIdentifiers && data.volumeInfo.industryIdentifiers[0].identifier) || ' '
    this.image = (data.volumeInfo.imageLinks && data.volumeInfo.imageLinks.thumbnail) || 'https://via.placeholder.com/250.png/fdff00/000';
    this.description = data.volumeInfo.description;
    this.bookshelf = (data.volumeInfo.categories && data.volumeInfo.categories[0]) || ' ';
}



/////////errors and listen////
app.get('*', (request, response) => {
    response.status(404).send('NOT FOUND');
})
client.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`listening on PORT ${PORT}`);
        })
    })