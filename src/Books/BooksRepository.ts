import { inject, injectable } from "inversify";
import { action, makeObservable, observable } from "mobx";
import { UserModel } from "../Authentication/UserModel";
import type { ErrorResult, IApiGateway } from "../Core/IApiGateway";
import { MessagesPresenter } from "../Core/Messages/MessagesPresenter";
import { TYPE } from "../Core/Types";

export enum BooksLoadState {
  UNSET = "UNSET",
  LOADED = "LOADED",
  RESET = "RESET",
}

export interface BookProgrammerModel {
  bookId: number;
  name: string;
}

export interface GetBooksResult_Book {
  bookId: number;
  name: string;
  emailOwnerId: string;
  devOwnerId: string;
}

export interface AddedBookResult {
  message: string;
  bookId: number;
}

type GetBooksResult = GetBooksResult_Book[];

@injectable()
export class BooksRepository {
  messagePM: BooksLoadState = BooksLoadState.UNSET;
  booksProgrammerModel: BookProgrammerModel[] = [];

  constructor(
    @inject(TYPE.IApiGateway) private _apiGateway: IApiGateway,
    @inject(UserModel) private _userModel: UserModel,
    @inject(MessagesPresenter) private _messagesPresenter: MessagesPresenter
  ) {
    makeObservable(this, {
      messagePM: observable,
      add: action,
      booksProgrammerModel: observable,
    });
  }

  load = async () => {
    const responseDto = await this._apiGateway.get(
      `/books?emailOwnerId=${this._userModel.email}`
    );
    if (!responseDto.success) {
      const errorResult = responseDto.result as ErrorResult;
      this._messagesPresenter.addError(errorResult.message);
      return;
    }

    const booksDto = responseDto.result as GetBooksResult;
    this.booksProgrammerModel = booksDto.map((book) => {
      return {
        bookId: book.bookId,
        name: book.name,
      };
    });
    this.messagePM = BooksLoadState.LOADED;
  };

  getBook = async (bookId: number): Promise<BookProgrammerModel> => {
    const responseDto = await this._apiGateway.get(
      `/book?emailOwnerId=${this._userModel.email}&bookId=${bookId}`
    );
    if (!responseDto.success) {
      const errorResult = responseDto.result as ErrorResult;
      throw new Error(errorResult.message);
    }

    const bookDto = (responseDto.result as GetBooksResult)[0];
    return {
      bookId: bookDto.bookId,
      name: bookDto.name,
    };
  };

  add = async (name: string): Promise<BookProgrammerModel | null> => {
    const emailOwnerId = this._userModel.email;
    const responseDto = await this._apiGateway.post("/books", {
      name,
      emailOwnerId,
    });
    if (!responseDto.success) {
      const errorResult = responseDto.result as ErrorResult;
      this._messagesPresenter.addError(errorResult.message);
      return null;
    }

    const addedBookResult = responseDto.result as AddedBookResult;
    this._messagesPresenter.addSuccess(addedBookResult.message);
    return {
      name,
      bookId: addedBookResult.bookId,
    };
  };

  reset = () => {
    this.messagePM = BooksLoadState.RESET;
  };

  stage = (name: string) => {
    this.booksProgrammerModel.push({
      name,
      bookId: Math.random(),
    });
  };
}
