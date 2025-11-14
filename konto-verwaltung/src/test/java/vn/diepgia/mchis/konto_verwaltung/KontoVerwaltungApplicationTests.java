package vn.diepgia.mchis.konto_verwaltung;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.Duration;
import java.util.List;

@SpringBootTest
class KontoVerwaltungApplicationTests {

	@Test
	void contextLoads() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--no-sandbox");
        options.setImplicitWaitTimeout(Duration.ofSeconds(10));
        WebDriver driver = new ChromeDriver(options);
        driver.get("https://www.vib.com.vn/en/ty-gia/bang-ty-gia");
        List<WebElement> element = driver.findElements(By.className("vib-v2-colum-table-deposit"));
        System.out.println(element.get(19).getText());
        for (WebElement e : element) System.out.println(e.getText());
        driver.quit();
	}

}
