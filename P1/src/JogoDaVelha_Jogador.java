import java.util.Scanner;

class JogoDaVelha_Jogador {
    private JogoDaVelha_Mapa mapa;
    private char letra;

    public JogoDaVelha_Jogador(JogoDaVelha_Mapa mapa) {
        this.mapa = mapa;
        letra = 'X';
    }

    public boolean joga(Scanner teclado) {
        System.out.println("Jogador ..");
        System.out.println("  linha:");
        int l = teclado.nextInt();
        System.out.println("  coluna:");
        int c = teclado.nextInt();

        if (mapa.jogar(l, c, letra)) {
            if (mapa.ganhou(letra)) {
                System.out.println("... Jogador GANHOU!");
                return true;
            }
            return false;
        } else {
            System.out.println("Célula ocupada ou jogada inválida. Jogue novamente.");
            return joga(teclado);
        }
    }
}