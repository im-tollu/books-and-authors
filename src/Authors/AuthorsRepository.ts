import { inject, injectable } from "inversify";
import { action, makeObservable, observable } from "mobx";
import { UserModel } from "../Authentication/UserModel";
import { BookProgrammerModel, BooksRepository } from "../Books/BooksRepository";
import type { ErrorResult, IApiGateway } from "../Core/IApiGateway";
import { MessagesPresenter } from "../Core/Messages/MessagesPresenter";
import { TYPE } from "../Core/Types";

export interface AuthorProgrammerModel {
  authorId: number;
  name: string;
  books: BookProgrammerModel[];
}

export interface GetAuthorsResult_Author {
  authorId: number;
  name: string;
  bookIds: number[];
}

interface AddedAuthorResult {
  message: string;
  authorId: number;
}

type GetAuthorsResult = GetAuthorsResult_Author[];

@injectable()
export class AuthorsRepository {
  authorsProgrammerModel: AuthorProgrammerModel[] = [];

  constructor(
    @inject(BooksRepository) private _booksRepository: BooksRepository,
    @inject(MessagesPresenter) private _messagesPresenter: MessagesPresenter,
    @inject(UserModel) private _userModel: UserModel,
    @inject(TYPE.IApiGateway) private _apiGateway: IApiGateway
  ) {
    makeObservable(this, {
      authorsProgrammerModel: observable,
      pushToProgrammerModel: action,
      setProgrammerModel: action,
      resetProgrammerModel: action,
      load: action,
    });
  }

  load = async () => {
    const responseDto = await this._apiGateway.get(
      `/authors?emailOwnerId=${this._userModel.email}`
    );
    if (!responseDto.success) {
      const errorResult = responseDto.result as ErrorResult;
      this._messagesPresenter.addError(errorResult.message);
      return;
    }

    this.resetProgrammerModel();
    const authorsDto = responseDto.result as GetAuthorsResult;

    const authorsProgrammerModel: AuthorProgrammerModel[] = [];

    for (const author of authorsDto) {
      const books: BookProgrammerModel[] = [];

      for (const bookId of author.bookIds) {
        const book = await this._booksRepository.getBook(bookId);
        books.push(book);
      }
      authorsProgrammerModel.push({
        authorId: author.authorId,
        name: author.name,
        books: books,
      });
    }

    this.setProgrammerModel(authorsProgrammerModel);
  };

  resetProgrammerModel = () => {
    this.authorsProgrammerModel.splice(0, this.authorsProgrammerModel.length);
    this._booksRepository.reset()
  };

  pushToProgrammerModel(author: AuthorProgrammerModel) {
    this.authorsProgrammerModel.push(author);
  }

  setProgrammerModel(authors: AuthorProgrammerModel[]) {
    this.authorsProgrammerModel = authors;
  }

  addAuthor = async (name: string) => {
    const bookIds: number[] = [];
    for (const book of this._booksRepository.booksProgrammerModel) {
      const lastAddedBook = await this._booksRepository.add(book.name);
      if (lastAddedBook !== null) {
        bookIds.push(lastAddedBook.bookId);
      }
    }

    const responseDto = await this._apiGateway.post("/authors", {
      name,
      bookIds,
      emailOwnerId: this._userModel.email,
    });
    if (!responseDto.success) {
      const errorResult = responseDto.result as ErrorResult;
      this._messagesPresenter.addError(errorResult.message);
      return;
    }
    const addedAuthorResult = responseDto.result as AddedAuthorResult;
    this._messagesPresenter.addSuccess(addedAuthorResult.message);
    this._booksRepository.booksProgrammerModel = [];
  };
}
