import { IQuestion, QuestionDropdownModel, ItemValue } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { PdfBrick } from './pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class DropdownBrick extends PdfBrick {
    protected question: QuestionDropdownModel;
    protected isQuestion: boolean;
    protected isMultiline: boolean;
    public constructor(question: IQuestion,
        protected controller: DocController, rect: IRect) {
        super(question, controller, rect);
        this.question = <QuestionDropdownModel>question;
    }
    public async render(): Promise<void> {
        let comboBox = new (<any>this.controller.doc.AcroFormComboBox)();
        comboBox.fieldName = this.question.id;
        comboBox.Rect = SurveyHelper.createAcroformRect(SurveyHelper.scaleRect(this,
            SurveyHelper.formScale(this.controller, this)));
        comboBox.edit = false;
        comboBox.color = SurveyHelper.TEXT_COLOR;
        let options: string[] = [];
        if (this.question.showOptionsCaption) {
            options.push(this.question.optionsCaption);
        }
        this.question.visibleChoices.forEach((item: ItemValue) => {
            options.push(SurveyHelper.getLocString(item.locText));
        });
        comboBox.setOptions(options);
        comboBox.fontName = this.controller.fontName;
        comboBox.isUnicode =
            this.controller.doc.internal.getFont(comboBox.fontName).encoding === 'Identity-H';
        comboBox.V = '';
        if (!!this.question.renderedValue) {
            comboBox.V = this.question.renderedValue;
        }
        else if (this.question.showOptionsCaption) {
            comboBox.V = this.question.optionsCaption;
        }
        this.controller.doc.addField(comboBox);
        SurveyHelper.wrapInBordersFlat(this.controller, this);
    }
}