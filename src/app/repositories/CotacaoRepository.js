const { initializeApp } = require('firebase/app');
const {
  getFirestore, doc, setDoc,
}  = require('firebase/firestore');

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

class FipeRepository {
  async findAll() {

    const initialize = initializeApp(firebaseConfig);
    const database = getFirestore(initialize);
  
    const response = await setDoc(doc(database, 'cotacaoSite', data.nome), {
      dadosCotacao: data,
    });

    return response;
  }

  async create(data) {
    const response = await fetch(`${url}/${endPoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }).then((res) => res.json());

    return response;
  }
}

module.exports = new FipeRepository();