import { IQuestion, ItemValue, QuestionCheckboxModel } from 'survey-core';
import { IRect, DocController } from "../doc_controller";
import { FlatSelectBase } from './flat_selectbase';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CheckboxItemBrick } from '../pdf_render/pdf_checkboxitem';

export class FlatCheckbox extends FlatSelectBase {
    protected question: QuestionCheckboxModel;
    public constructor(question: IQuestion, protected controller: DocController) {
        super(question, controller);
        this.question = <QuestionCheckboxModel>question;
    }
    public createItemBrick(rect: IRect, item: ItemValue, index: number): IPdfBrick {
        return new CheckboxItemBrick(this.question, this.controller, rect, item, index);
    }
}

FlatRepository.getInstance().register('checkbox', FlatCheckbox);