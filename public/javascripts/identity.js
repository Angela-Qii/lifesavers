import java.awt.*;
import java.util.Random;

public class Mondrian {
    private static final Color[] COLORS = {Color.RED, Color.YELLOW, Color.CYAN, Color.WHITE};
    private static final Random RAND = new Random();

    public void paintBasicMondrian(Color[][] pixels) {
        int width = pixels[0].length;
        int height = pixels.length;
        divideAndColor(pixels, 0, 0, width, height, width, height);
    }

    public void paintComplexMondrian(Color[][] pixels) {
        int width = pixels[0].length;
        int height = pixels.length;
        divideAndColorComplex(pixels, 0, 0, width, height, width, height);
    }

    // Recursive function for basic Mondrian painting
    private void divideAndColor(Color[][] pixels, int x, int y, int width, int height, int canvasWidth, int canvasHeight) {
        if (width < canvasWidth / 4 && height < canvasHeight / 4) {
            fillRegion(pixels, x, y, width, height, getRandomColor());
            return;
        }

        boolean splitVertically = width >= canvasWidth / 4;
        boolean splitHorizontally = height >= canvasHeight / 4;

        if (splitVertically) {
            int splitX = x + 10 + RAND.nextInt(width - 20);
            divideAndColor(pixels, x, y, splitX - x, height, canvasWidth, canvasHeight);
            divideAndColor(pixels, splitX, y, width - (splitX - x), height, canvasWidth, canvasHeight);
        }

        if (splitHorizontally) {
            int splitY = y + 10 + RAND.nextInt(height - 20);
            divideAndColor(pixels, x, y, width, splitY - y, canvasWidth, canvasHeight);
            divideAndColor(pixels, x, splitY, width, height - (splitY - y), canvasWidth, canvasHeight);
        }
    }

    // Recursive function for complex Mondrian painting (color influenced by location)
    private void divideAndColorComplex(Color[][] pixels, int x, int y, int width, int height, int canvasWidth, int canvasHeight) {
        if (width < canvasWidth / 4 && height < canvasHeight / 4) {
            fillRegion(pixels, x, y, width, height, getBiasedColor(x, y, canvasWidth, canvasHeight));
            return;
        }

        boolean splitVertically = width >= canvasWidth / 4;
        boolean splitHorizontally = height >= canvasHeight / 4;

        if (splitVertically) {
            int splitX = x + 10 + RAND.nextInt(width - 20);
            divideAndColorComplex(pixels, x, y, splitX - x, height, canvasWidth, canvasHeight);
            divideAndColorComplex(pixels, splitX, y, width - (splitX - x), height, canvasWidth, canvasHeight);
        }

        if (splitHorizontally) {
            int splitY = y + 10 + RAND.nextInt(height - 20);
            divideAndColorComplex(pixels, x, y, width, splitY - y, canvasWidth, canvasHeight);
            divideAndColorComplex(pixels, x, splitY, width, height - (splitY - y), canvasWidth, canvasHeight);
        }
    }

    private void fillRegion(Color[][] pixels, int x, int y, int width, int height, Color color) {
        for (int i = x + 1; i < x + width - 1; i++) {
            for (int j = y + 1; j < y + height - 1; j++) {
                pixels[j][i] = color;
            }
        }

        for (int i = x; i < x + width; i++) {
            pixels[y][i] = Color.BLACK;
            pixels[y + height - 1][i] = Color.BLACK;
        }
        for (int j = y; j < y + height; j++) {
            pixels[j][x] = Color.BLACK;
            pixels[j][x + width - 1] = Color.BLACK;
        }
    }

    private Color getRandomColor() {
        return COLORS[RAND.nextInt(COLORS.length)];
    }

    private Color getBiasedColor(int x, int y, int canvasWidth, int canvasHeight) {
        double redBias = 1.0 - ((double) x / canvasWidth) - ((double) y / canvasHeight);
        double blueBias = ((double) x / canvasWidth) + ((double) y / canvasHeight);

        int r = (int) (255 * Math.max(0, redBias));
        int g = RAND.nextInt(100) + 50; // Random green component for variety
        int b = (int) (255 * Math.max(0, blueBias));

        return new Color(r, g, b);
    }
}
