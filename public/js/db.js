// offline data
db.enablePersistence()
.catch(err =>{
    if (err.code == 'failed-precondition') {
        //multiple tabs open at once
        console.log('persistence failed');
    }else if (err.code == 'unimplemented') {
        //lack of browser support
        console.log('persistence is not available');
    }
})

//realtime listener. checks if something has changed in the db
db.collection('recipes').onSnapshot((snapshot) => {
    // console.log(snapshot.docChanges());
    snapshot.docChanges().forEach(change => {
        // console.log(change, change.doc.data(), change.doc.id);
        if(change.type === 'added'){
            //add the document data to the web page
            renderRecipe(change.doc.data(), change.doc.id);
        }
        if (change.type === 'removed') {
            //remove the document data form the web page
            removeRecipe(change.doc.id);
        }
    });
})


// add new car
const form = document.querySelector('form');
form.addEventListener('submit', evt => {
    evt.preventDefault();

    const recipe = {
        title: form.title.value,
        ingredients: form.ingredients.value
    };

    db.collection('recipes').add(recipe)
    .catch(err => console.log(err));

    form.title.value = '';
    form.ingredients.value = '';
});


// delete car
const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', evt =>{
    // console.log(evt);
if (evt.target.tagName === 'I') {
    const id = evt.target.getAttribute('data-id')
    db.collection('recipes').doc(id).delete();
}
})