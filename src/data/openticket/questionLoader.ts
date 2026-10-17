import { opendiscord, api, utilities } from "../../index.js"

export async function loadAllQuestions() {
    const questionConfig = opendiscord.configs.get("opendiscord:questions")
    if (!questionConfig) return

    for (const question of questionConfig.data){
        if (question.type === "short") opendiscord.questions.add(loadShortQuestion(question))
        else if (question.type === "paragraph") opendiscord.questions.add(loadParagraphQuestion(question))
        else if (question.type === "dropdown") opendiscord.questions.add(loadDropdownQuestion(question))
        else if (question.type === "radio-select") opendiscord.questions.add(loadRadioSelectQuestion(question))
        else if (question.type === "checkbox-select") opendiscord.questions.add(loadCheckboxSelectQuestion(question))
        else if (question.type === "file-upload") opendiscord.questions.add(loadFileUploadQuestion(question))
        else if (question.type === "text-display") opendiscord.questions.add(loadTextDisplayQuestion(question))
    }

    //update questions on config reload
    questionConfig.onReload(async () => {
        //clear previous questions
        await opendiscord.questions.loopAll((data, id) => {opendiscord.questions.remove(id)})

        //add new questions
        for (const question of questionConfig.data){
            if (question.type === "short") opendiscord.questions.add(loadShortQuestion(question))
            else if (question.type === "paragraph") opendiscord.questions.add(loadParagraphQuestion(question))
            else if (question.type === "dropdown") opendiscord.questions.add(loadDropdownQuestion(question))
            else if (question.type === "radio-select") opendiscord.questions.add(loadRadioSelectQuestion(question))
            else if (question.type === "checkbox-select") opendiscord.questions.add(loadCheckboxSelectQuestion(question))
            else if (question.type === "file-upload") opendiscord.questions.add(loadFileUploadQuestion(question))
            else if (question.type === "text-display") opendiscord.questions.add(loadTextDisplayQuestion(question))
        }
    })
}

export const loadShortQuestion = (option:api.ODQuestionsJsonConfig_ShortQuestion) => {
    return new api.ODShortQuestion(option.id, [
        new api.ODQuestionData("opendiscord:name", option.name),
        new api.ODQuestionData("opendiscord:description", option.description),
        new api.ODQuestionData("opendiscord:required", option.required),

        new api.ODQuestionData("opendiscord:placeholder", option.placeholder),
        new api.ODQuestionData("opendiscord:length-enabled", option.length.enabled),
        new api.ODQuestionData("opendiscord:length-min", option.length.min),
        new api.ODQuestionData("opendiscord:length-max", option.length.max)
    ])
}

export const loadParagraphQuestion = (option:api.ODQuestionsJsonConfig_ParagraphQuestion) => {
    return new api.ODParagraphQuestion(option.id, [
        new api.ODQuestionData("opendiscord:name", option.name),
        new api.ODQuestionData("opendiscord:description", option.description),
        new api.ODQuestionData("opendiscord:required", option.required),

        new api.ODQuestionData("opendiscord:placeholder", option.placeholder),
        new api.ODQuestionData("opendiscord:length-enabled", option.length.enabled),
        new api.ODQuestionData("opendiscord:length-min", option.length.min),
        new api.ODQuestionData("opendiscord:length-max", option.length.max)
    ])
}

export const loadDropdownQuestion = (option:api.ODQuestionsJsonConfig_DropdownQuestion) => {
    return new api.ODDropdownQuestion(option.id, [
        new api.ODQuestionData("opendiscord:name", option.name),
        new api.ODQuestionData("opendiscord:description", option.description),
        new api.ODQuestionData("opendiscord:required", option.required),

        new api.ODQuestionData("opendiscord:placeholder", option.placeholder),
        new api.ODQuestionData("opendiscord:choices", option.choices)
    ])
}

export const loadRadioSelectQuestion = (option:api.ODQuestionsJsonConfig_RadioSelectQuestion) => {
    return new api.ODRadioSelectQuestion(option.id, [
        new api.ODQuestionData("opendiscord:name", option.name),
        new api.ODQuestionData("opendiscord:description", option.description),
        new api.ODQuestionData("opendiscord:required", option.required),

        new api.ODQuestionData("opendiscord:choices", option.choices)
    ])
}

export const loadCheckboxSelectQuestion = (option:api.ODQuestionsJsonConfig_CheckboxSelectQuestion) => {
    return new api.ODCheckboxSelectQuestion(option.id, [
        new api.ODQuestionData("opendiscord:name", option.name),
        new api.ODQuestionData("opendiscord:description", option.description),
        new api.ODQuestionData("opendiscord:required", option.required),

        new api.ODQuestionData("opendiscord:limits-enabled", option.limits.enabled),
        new api.ODQuestionData("opendiscord:limits-min", option.limits.min),
        new api.ODQuestionData("opendiscord:limits-max", option.limits.max),
        new api.ODQuestionData("opendiscord:choices", option.choices)
    ])
}

export const loadFileUploadQuestion = (option:api.ODQuestionsJsonConfig_FileUploadQuestion) => {
    return new api.ODFileUploadQuestion(option.id, [
        new api.ODQuestionData("opendiscord:name", option.name),
        new api.ODQuestionData("opendiscord:description", option.description),
        new api.ODQuestionData("opendiscord:required", option.required),

        new api.ODQuestionData("opendiscord:limits-enabled", option.limits.enabled),
        new api.ODQuestionData("opendiscord:limits-min", option.limits.min),
        new api.ODQuestionData("opendiscord:limits-max", option.limits.max)
    ])
}

export const loadTextDisplayQuestion = (option:api.ODQuestionsJsonConfig_TextDisplayQuestion) => {
    return new api.ODTextDisplayQuestion(option.id, [
        new api.ODQuestionData("opendiscord:text-contents", option.textContents)
    ])
}