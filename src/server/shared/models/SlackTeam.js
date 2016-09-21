import thinky from './thinky'

const type = thinky.type

const SlackTeam = thinky.createModel('SlackTeam', {
    id: type.string(),
    name: type.string(),
    accessToken: type.string()
})

SlackTeam.defineStatic('checkIfTeamExist', async function(id) {
    try {
        const team = await this.get(id).run()

        return !!team
    } catch (error) {

        if (error && error.name === 'DocumentNotFoundError')
            return false

        throw error
    }
})

export default SlackTeam
