import { WebServicePage } from './app.po';

describe('web-service App', () => {
  let page: WebServicePage;

  beforeEach(() => {
    page = new WebServicePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
