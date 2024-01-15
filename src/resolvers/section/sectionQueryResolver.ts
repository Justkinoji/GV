import SectionService from "../../services/SectionService";

const sectionQueryResolver = {
    Query: {
        async getAllSections(){
            try {

                return await SectionService.getAllSections();

            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to get sections.');
            }
        },

        async getOneSection(_: any, { id }: { id: string }){
            try {

                return await SectionService.getOneSection(id);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to get section.');
            }
        },

        async getSectionByName(_: any, { name }: { name: string }){
            try {

                return await SectionService.getByName(name);
            } catch (error) {
                console.error('Error:', error);
                throw new Error('Failed to get section.');
            }
        }
    }
}

export default sectionQueryResolver;
