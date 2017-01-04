import process from 'process'

let alchemyAppKey

if (process.env.NODE_ENV === 'production') {
    alchemyAppKey = process.env.ALCHEMY_API_KEY
} else {
    alchemyAppKey = 'a191ddd8108b0c9207eab5bb68d4f22a027eeebe'
}

export default {alchemyAppKey}



