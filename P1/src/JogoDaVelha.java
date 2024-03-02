import java.util.Scanner;

public class JogoDaVelha {
    private JogoDaVelha_Mapa jogoMapa;
    private JogoDaVelha_PC jogoPC;
    private JogoDaVelha_Jogador jogoJogador;

    private void jogar(Scanner teclado) {
        jogoMapa.limparMapa();
        int jogada = 0;

        boolean jogadorComeca = (Math.random() > 0.5);

        while (jogada < 9) {
            jogoMapa.desenha(jogada);

            if ((jogadorComeca && jogada % 2 == 0) || (!jogadorComeca && jogada % 2 != 0)) {
                if (jogoJogador.joga(teclado)) {
                    break;
                }
            } else {
                if (jogoPC.joga()) {
                    break;
                }
            }
            jogada++;
        }

        jogoMapa.desenha(jogada);
    }

    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);

        JogoDaVelha jogo = new JogoDaVelha();
        jogo.jogoMapa = new JogoDaVelha_Mapa();
        jogo.jogoPC = new JogoDaVelha_PC(jogo.jogoMapa);
        jogo.jogoJogador = new JogoDaVelha_Jogador(jogo.jogoMapa);

        char jogarNovamente;
        do {
            jogo.jogar(teclado);
            System.out.println("\nDeseja jogar novamente (s/n)?");
            jogarNovamente = teclado.next().charAt(0);
        } while (jogarNovamente == 's');

        System.out.println("--- FIM ---");
        teclado.close();
    }
}
