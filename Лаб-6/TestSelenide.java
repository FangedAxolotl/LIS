import com.codeborne.selenide.Condition;
import com.codeborne.selenide.SelenideElement;
import org.junit.Test;
import org.openqa.selenium.By;

import static com.codeborne.selenide.CollectionCondition.size;
import static com.codeborne.selenide.Condition.*;
import static com.codeborne.selenide.Selectors.byXpath;
import static com.codeborne.selenide.Selenide.*;
import static com.codeborne.selenide.WebDriverConditions.url;
import static com.codeborne.selenide.Selenide.*;
import static java.lang.Integer.parseInt;
import static java.nio.file.Files.find;
import static org.openqa.selenium.By.cssSelector;

public class TestSelenide {
    @Test
    public void testGoogle(){
        open("https://www.google.ru/");
        $x("//textarea[@name= 'q']").setValue("Selenium").pressEnter();
        $x("//div[@id= 'result-stats']").shouldBe(visible);
    }

    @Test
    public void testMangaLib() {
        //1.Открытие сайта
        open("https://mangalib.me/");
        //2.Проверка наличия поисковой строки
        $x("//span[@id= 'search-link']").click();
        //3.Появление на странице
        $x("//input[@class= 'search__input form__input autocomplete__input']").shouldBe(Condition.appear);
        //4.Проверка ввода слова в поиск
        $x("//input[@class= 'search__input form__input autocomplete__input']").setValue("Бездомный Бог");
        $x("//div[@class= 'search__suggestions autocomplete__suggestions']").shouldBe(visible);
        //5.Проверка открытия манги
        $x("//div[@class= 'manga-list-item__body']").click();
        webdriver().shouldHave(url("https://mangalib.me/noragami?section=info"));
        //6.Проверка наведения на теги
        $x("//a[@href= 'https://mangalib.me/manga-list?genres%5Binclude%5D%5B%5D=34']").hover();
        $x("//a[@href= 'https://mangalib.me/manga-list?genres%5Binclude%5D%5B%5D=35']").hover();
        //7.Проверка открытия режима чтения
        $x("//a[@class='button button_block button_primary']").click();
        webdriver().shouldHave(url("https://mangalib.me/noragami/v1/c1?page=1"));
        //8.Проверка перехода на след. страницу
        $x("//div[@class= 'reader-view__wrap']").click();
        //9.Проверка кнопки навигации
        $x("//i[@class= 'fa fa-bars fa-fw']").click();
        //10.Проверка выхода на главную страницу
        $x("//a[@href= '/']").click();
        //11.Проверка наведения на значок изменения темы страницы
        $x("//div[@class= 'header-button__icon tooltip']").hover();
        //12.Проверка изменения темы
        $x("//div[@class= 'header-button__icon tooltip']").click();
        //13.Проверка выхода на форум
        $x("//a[@href= 'https://mangalib.me/forum']").click();
        //14.Проверка появления
        $x("//input[@class= 'discussions-search form__input']").shouldBe(visible);
        //15.Проверка на появление поисковой строки на форуме
        $x("//input[@class= 'discussions-search form__input']").shouldBe(Condition.appear);
        //16.Проверка поиска по слову
        $x("//input[@class= 'discussions-search form__input']").setValue("Вопросы").pressEnter();
        $x("//a[@href= '/forum/discussion/509061']").shouldBe(visible);
        //17.Проверка наведения на первый ответ по запросу
        $x("//a[@href= '/forum/discussion/509061']").hover();
        //18.Проверка открытия первого ответа на запрос
        $x("//a[@href= '/forum/discussion/509061']").click();
        //19.Появление страницы
        webdriver().shouldHave(url("https://lib.social/forum/discussion/509061"));
        //20.Проверка выхода на FAQ
        $x("//a[@href= 'https://lib.social/faq']").click();
    }
}
