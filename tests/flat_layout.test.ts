(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};

import { Question, QuestionCheckboxModel } from 'survey-core';
import { PdfSurvey } from '../src/survey';
import { IPoint, IRect, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatQuestion } from '../src/flat_layout/flat_question';
import { FlatTextbox } from '../src/flat_layout/flat_textbox';
import { FlatCheckbox } from '../src/flat_layout/flat_checkbox';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_tx = new FlatTextbox(null, null);
let __dummy_cb = new FlatCheckbox(null, null);

function calcTitleTop(controller: DocController, titleQuestion: Question,
    titleFlat: IPdfBrick, textboxFlat: IPdfBrick,
    leftTopPoint: IPoint, descFlat: IPdfBrick = null): IPoint {
    let assumeTitle: IRect = SurveyHelper.createTextRect(
        leftTopPoint, controller,
        SurveyHelper.getTitleText(titleQuestion));
    TestHelper.equalRect(expect, titleFlat, assumeTitle);
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        SurveyHelper.createPoint(assumeTitle), controller);
    if (descFlat != null) {
        let assumeDesc: IRect = SurveyHelper.createDescRect(
            SurveyHelper.createPoint(assumeTitle), controller,
            SurveyHelper.getLocString(titleQuestion.locDescription));
        TestHelper.equalRect(expect, descFlat, assumeDesc);
        assumeTextbox = SurveyHelper.createTextFieldRect(
            SurveyHelper.createPoint(assumeDesc), controller);
    }
    TestHelper.equalRect(expect, textboxFlat, assumeTextbox);
    return SurveyHelper.createPoint(assumeTextbox);
}
function calcTitleBottom(controller: DocController, titleQuestion: Question,
    titleFlat: IPdfBrick, textboxFlat: IPdfBrick, descFlat: IPdfBrick = null) {
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        controller.leftTopPoint, controller);
    TestHelper.equalRect(expect, textboxFlat, assumeTextbox);
    let assumeTitle: IRect = SurveyHelper.createTextRect(
        SurveyHelper.createPoint(assumeTextbox), controller,
        SurveyHelper.getTitleText(titleQuestion));
    TestHelper.equalRect(expect, titleFlat, assumeTitle);
    if (descFlat != null) {
        let assumeDesc: IRect = SurveyHelper.createDescRect(
            SurveyHelper.createPoint(assumeTitle), controller,
            SurveyHelper.getLocString(titleQuestion.locDescription));
        TestHelper.equalRect(expect, descFlat, assumeDesc);
    }
}
function calcTitleLeft(controller: DocController, titleQuestion: Question,
    titleFlat: IPdfBrick, textboxFlat: IPdfBrick, descFlat: IPdfBrick = null) {
    let assumeTitle: IRect = SurveyHelper.createTextRect(
        controller.leftTopPoint, controller,
        SurveyHelper.getTitleText(titleQuestion));
    TestHelper.equalRect(expect, titleFlat, assumeTitle);
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        SurveyHelper.createPoint(assumeTitle, false, true), controller);
    if (descFlat != null) {
        let assumeDesc: IRect = SurveyHelper.createDescRect(
            SurveyHelper.createPoint(assumeTitle), controller,
            SurveyHelper.getLocString(titleQuestion.locDescription));
        TestHelper.equalRect(expect, descFlat, assumeDesc);
        assumeTextbox.xLeft = Math.max(assumeTextbox.xLeft, assumeDesc.xRight);
    }
    TestHelper.equalRect(expect, textboxFlat, assumeTextbox);
}

test('Calc textbox boundaries title top', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Title top'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(2);
    calcTitleTop(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[0], flats[1], survey.controller.leftTopPoint);
});
test('Calc textbox boundaries title bottom', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Title bottom',
                titleLocation: 'bottom'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(2);
    calcTitleBottom(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[1], flats[0]);
});
test('Calc textbox boundaries title left', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Title left',
                titleLocation: 'left'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(2);
    calcTitleLeft(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[0], flats[1]);
});
test('Calc textbox boundaries title hidden', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Title hidden',
                titleLocation: 'hidden'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let controller: DocController = survey.controller;
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        controller.leftTopPoint, controller);
    TestHelper.equalRect(expect, flats[0], assumeTextbox);
});
test('Generate rects array comment', () => {
    let question: QuestionCheckboxModel = new QuestionCheckboxModel('test');
    question.hasComment = true;
    question.titleLocation = 'hidden';
    let docController = new DocController(TestHelper.defaultOptions);
    let flatQuestion: FlatQuestion = new FlatQuestion(question, new DocController(docController));
    let resultRects: IRect[] = flatQuestion.generateFlats(TestHelper.defaultPoint);
    let assumeTextRect: IRect = SurveyHelper.createTextRect(TestHelper.defaultPoint, docController, question.commentText);
    let assumeTextFieldRect: IRect = SurveyHelper.createTextFieldRect(SurveyHelper.createPoint(assumeTextRect), docController, 2);
    let assumeRects: IRect[] = [assumeTextRect, assumeTextFieldRect];
    TestHelper.equalRects(expect, resultRects, assumeRects);
})
//todo
test.skip('point for comment, title : top', () => {
    let question: QuestionCheckboxModel = new QuestionCheckboxModel('test');
    question.hasComment = true;
    question.titleLocation = 'top';
    let docController = new DocController(TestHelper.defaultOptions);
    let flatQuestion: FlatQuestion = new FlatQuestion(question, new DocController(docController));

    let resultRects: IRect[] = flatQuestion.generateFlats(TestHelper.defaultPoint);
    let assumeTitleRect: IRect = SurveyHelper.createTextRect(TestHelper.defaultPoint, docController, question.title);
    let assumeTextRect: IRect = SurveyHelper.createTextRect(SurveyHelper.createPoint(assumeTitleRect), docController, question.commentText);
    let assumeTextFieldRect: IRect = SurveyHelper.createTextFieldRect(SurveyHelper.createPoint(assumeTextRect), docController, 2);
    let assumeRects: IRect[] = [assumeTextRect, assumeTextFieldRect];
    TestHelper.equalRects(expect, resultRects, assumeRects);
});
//todo
test.skip('point for comment, title : bottom', () => {
    let question: QuestionCheckboxModel = new QuestionCheckboxModel('test');
    question.choices = ['test'];
    question.hasComment = true;
    question.titleLocation = 'hidden';
    let docController = new DocController(TestHelper.defaultOptions);
});
//todo
test.skip('point for comment, title : left', () => {
    let question: QuestionCheckboxModel = new QuestionCheckboxModel('test');
    question.choices = ['test'];
    question.hasComment = true;
    question.titleLocation = 'hidden';
    let docController = new DocController(TestHelper.defaultOptions);
});
//todo
test.skip('point for comment, title : right', () => {
    let question: QuestionCheckboxModel = new QuestionCheckboxModel('test');
    question.choices = ['test'];
    question.hasComment = true;
    question.titleLocation = 'hidden';
    let docController = new DocController(TestHelper.defaultOptions);
});
test('Calc boundaries with space between questions', () => {
    let json = {
        questions: [{
            type: 'text',
            name: 'textbox1',
            title: 'What have we here?'
        },
        {
            type: 'text',
            name: 'textbox2',
            title: 'Space between questions!'
        }]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(4);
    let title2point: IPoint = calcTitleTop(survey.controller,
        <Question>survey.getAllQuestions()[0],
        flats[0], flats[1], survey.controller.leftTopPoint);
    title2point.yTop += survey.controller.measureText().height;
    calcTitleTop(survey.controller, <Question>survey.getAllQuestions()[1],
        flats[2], flats[3], title2point);
});
test('Calc textbox boundaries title without number', () => {
    let json = {
        questions: [{
            type: 'text',
            name: 'textbox',
            title: 'I do not need a number'
        }]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    survey.showQuestionNumbers = 'off';
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(2);
    calcTitleTop(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[0], flats[1], survey.controller.leftTopPoint);
});
test('Calc textbox boundaries required', () => {
    let json = {
        questions: [{
            type: 'text',
            name: 'textbox',
            title: 'Please enter your name:',
            isRequired: true
        }]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(2);
    calcTitleTop(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[0], flats[1], survey.controller.leftTopPoint);
});
test('Check that checkbox has square boundaries', () => {
    let json = {
        questions: [
            {
                type: 'checkbox',
                name: 'box',
                title: 'Square Pants',
                choices: [
                    'S'
                ]
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let controller: DocController = survey.controller;
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(3);
    let assumeTitle: IRect = SurveyHelper.createTextRect(
        controller.leftTopPoint, controller,
        SurveyHelper.getTitleText(<Question>survey.getAllQuestions()[0]));
    TestHelper.equalRect(expect, flats[0], assumeTitle);
    let assumeCheckbox: IRect = SurveyHelper.createRect(
        SurveyHelper.createPoint(assumeTitle),
        controller.measureText().height, controller.measureText().height);
    TestHelper.equalRect(expect, flats[1], assumeCheckbox);
});
test('Calc boundaries title top longer than description', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'My title is so interesting',
                description: 'But the description is not enough'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(3);
    calcTitleTop(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[0], flats[2], survey.controller.leftTopPoint, flats[1]);
});
test('Calc boundaries title top shorter than description', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'Tiny title',
                description: 'The description is so long, very long, very'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(3);
    calcTitleTop(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[0], flats[2], survey.controller.leftTopPoint, flats[1]);
});
test('Calc boundaries title bottom longer than description', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'What a gorgeous title',
                titleLocation: 'bottom',
                description: 'Who reads the descriptions?'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(3);
    calcTitleBottom(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[1], flats[0], flats[2]);
});
test('Calc boundaries title bottom shorter than description', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'Piece of title',
                titleLocation: 'bottom',
                description: 'Very important information: required to read'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(3);
    calcTitleBottom(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[1], flats[0], flats[2]);
});
test('Calc boundaries title left longer than description', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'I only wish that wisdom',
                titleLocation: 'left',
                description: 'Oh dear Pan'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(3);
    calcTitleLeft(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[0], flats[2], flats[1]);
});
test('Calc boundaries title left shorter than description', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'box',
                title: 'Diamonds',
                titleLocation: 'left',
                description: 'Takes One To Know One'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(3);
    calcTitleLeft(survey.controller, <Question>survey.getAllQuestions()[0],
        flats[0], flats[2], flats[1]);
});
test('Calc boundaries title hidden with description', () => {
    let json = {
        questions: [
            {
                type: 'text',
                name: 'textbox',
                title: 'Ninja',
                titleLocation: 'hidden',
                description: 'Under cover of night'
            }
        ]
    };
    let survey: PdfSurvey = new PdfSurvey(json, TestHelper.defaultOptions);
    let controller: DocController = survey.controller;
    let flats: IPdfBrick[] = FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    let assumeTextbox: IRect = SurveyHelper.createTextFieldRect(
        controller.leftTopPoint, controller);
    TestHelper.equalRect(expect, flats[0], assumeTextbox);
});

//TODO empty choices checkbox tests