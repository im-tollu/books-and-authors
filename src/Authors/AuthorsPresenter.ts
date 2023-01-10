import { inject, injectable } from "inversify";
import { action, computed, makeObservable, observable } from "mobx";
import { BooksRepository } from "../Books/BooksRepository";
import { IAddBookPresenter } from "../Books/IAddBookPresenter";
import { MessagesPresenter } from "../Core/Messages/MessagesPresenter";
import { AuthorsRepository } from "./AuthorsRepository";

export interface AuthorViewModel {
  authorId: number;
  name: string;
  bookTitles: string;
}

@injectable()
export class AuthorsPresenter implements IAddBookPresenter {
  newBookName: string = "";
  newAuthorName: string = "";
  addedBooks: string[] = [];
  showAuthorsList: boolean = false;

  constructor(
    @inject(AuthorsRepository) private _authorsRepository: AuthorsRepository,
    @inject(BooksRepository) private _booksRepository: BooksRepository,
    @inject(MessagesPresenter) private _messagePresenter: MessagesPresenter
  ) {
    makeObservable(this, {
      newBookName: observable,
      newAuthorName: observable,
      showAuthorsList: observable,
      viewModel: computed,
      load: action,
    });
  }

  get viewModel(): AuthorViewModel[] {
    return this._authorsRepository.authorsProgrammerModel.map((authorPM) => {
      return {
        authorId: authorPM.authorId,
        name: authorPM.name,
        bookTitles: authorPM.books.map((book) => book.name).join(","),
      };
    });
  }

  load = async () => {
    await this._authorsRepository.load();
    if (this._authorsRepository.authorsProgrammerModel.length > 4) {
      this.showAuthorsList = false;
    } else {
      this.showAuthorsList = true;
    }
  };

  addBook = async () => {
    this._messagePresenter.reset();
    if (this.newBookName === "") {
      this._messagePresenter.addWarning("No book name");
      return;
    }
    this._booksRepository.stage(this.newBookName);
    this.newBookName = "";
  };

  addAuthor = async () => {
    this._messagePresenter.reset();
    if (this.newAuthorName === "") {
      this._messagePresenter.addWarning("No author name");
      return;
    }
    await this._authorsRepository.addAuthor(this.newAuthorName);
    this.newAuthorName = "";
    await this.load();
  };

  toggleShowAuthorsList = () => {
    this.showAuthorsList = !this.showAuthorsList;
  };
}
