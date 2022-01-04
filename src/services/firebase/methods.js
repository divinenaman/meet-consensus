import { getFirestore, addDoc, doc, getDoc, collection, getDocs } from 'firebase/firestore';

const firestore = getFirestore();

export async function add(collection_name, data) {
    try {
        await addDoc(collection(firestore, collection_name), data)
        return true
    } catch(e) {
        console.log(e)
        return false
    }    
}

export async function getSingle(collection_name, doc_id) {
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

export async function getMultiple(collection_name) {
    try {
        const res = await getDocs(collection(firestore, collection_name));
        let arr = []
        res.forEach(d=>arr.append(d))
        return arr
    } catch(e) {
        console.log(e);
        return null
    }
}