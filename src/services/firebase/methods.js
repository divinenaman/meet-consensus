import { getFirestore, addDoc, doc, getDoc, collection, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';

const firestore = getFirestore();

const preprocessor = {
    "list": {
        append(key, value) {
            return {
                [key]: arrayUnion(value)
            }
        }
    }
}

async function add(collection_name, data) {
    try {
        const res = await addDoc(collection(firestore, collection_name), data)
        return res
    } catch(e) {
        console.log(e)
        return false
    }    
}

async function update(collection_name, doc_id, data) {
    try {
        const res = await updateDoc(doc(firestore, collection_name, doc_id), data)
        return res
    } catch(e) {
        console.log(e)
        return false
    }    
}

async function getSingle(collection_name, doc_id) {
    try {
        const res = await getDoc(doc(firestore, collection_name, doc_id));
        if (res.exists()) {
            return res.data()
        } else {
            return null
        }
    } catch(e) {
        console.log(e)
        return null
    }
} 

async function getMultiple(collection_name) {
    try {
        const res = await getDocs(collection(firestore, collection_name));
        let arr = {}
        res.forEach(d=>arr[d.id] = d.data())
        return arr
    } catch(e) {
        console.log(e);
        return null
    }
}

export default {
    preprocessor,
    add,
    update,
    getSingle,
    getMultiple
}