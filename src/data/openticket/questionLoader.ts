import {openticket, api, utilities} from "../../index"

export const loadAllQuestions = async () => {
    const questionConfig = openticket.configs.get("openticket:questions")
    if (!questionConfig) return
    
    questionConfig.data.forEach((question) => {
        if (question.type == "short"){
            openticket.questions.add(loadShortQuestion(question))
        }else if (question.type == "paragraph"){
            openticket.questions.add(loadParagraphQuestion(question))
        }
    })

    //update questions on config reload
    questionConfig.onReload(async () => {
        //clear previous questions
        await openticket.questions.loopAll((data,id) => {openticket.questions.remove(id)})

        //add new questions
        questionConfig.data.forEach((question) => {
            if (question.type == "short"){
                openticket.questions.add(loadShortQuestion(question))
            }else if (question.type == "paragraph"){
                openticket.questions.add(loadParagraphQuestion(question))
            }
        })
    })
}

export const loadShortQuestion = (option:api.ODJsonConfig_DefaultShortQuestionType) => {
    return new api.ODShortQuestion(option.id,[
        new api.ODQuestionData("openticket:name",option.name),
        new api.ODQuestionData("openticket:required",option.required),
        new api.ODQuestionData("openticket:placeholder",option.placeholder),

        new api.ODQuestionData("openticket:length-enabled",option.length.enabled),
        new api.ODQuestionData("openticket:length-min",option.length.min),
        new api.ODQuestionData("openticket:length-max",option.length.max),
    ])
}

export const loadParagraphQuestion = (option:api.ODJsonConfig_DefaultParagraphQuestionType) => {
    return new api.ODParagraphQuestion(option.id,[
        new api.ODQuestionData("openticket:name",option.name),
        new api.ODQuestionData("openticket:required",option.required),
        new api.ODQuestionData("openticket:placeholder",option.placeholder),

        new api.ODQuestionData("openticket:length-enabled",option.length.enabled),
        new api.ODQuestionData("openticket:length-min",option.length.min),
        new api.ODQuestionData("openticket:length-max",option.length.max),
    ])
}