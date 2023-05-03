const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDocs, collection} = require('firebase/firestore');
const { randomBytes } = require('crypto');

const firebaseConfig = {
  apiKey: 'AIzaSyBdlk20of_KtjBbCcnY1FTIeQxm1a6GnF4',
  authDomain: 'form-cuidar-app.firebaseapp.com',
  databaseURL: 'https://form-cuidar-app.firebaseio.com',
  projectId: 'form-cuidar-app',
  storageBucket: 'form-cuidar-app.appspot.com',
  messagingSenderId: '897470138579',
  appId: '1:897470138579:web:81d76d46464f6e42',
  measurementId: 'G-271VB7MGDK',
};


const initialize = initializeApp(firebaseConfig);
const database = getFirestore(initialize);

class FipeRepository {
  async findAll() {
    const response = [];
    const documents = await getDocs(collection(database, 'cotacoes'));

    documents.forEach((document) => response.push(document.data()));

    return response;
  }

  async create(data) {
    const id = randomBytes(8).toString('hex');
    const response = await setDoc(doc(database, 'cotacoes', id), {
      dadosCotacao: data,
      id,
    });

    return response;
  }
}

module.exports = new FipeRepository();