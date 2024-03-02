class JogoDaVelha_Mapa {
    private char[][] mapa;

    public int sortear(int inicio, int fim) {
        return (int) (Math.random() * (fim - inicio + 1));
    }

    public void limparMapa() {
        mapa = new char[3][3];
        for (int i = 0; i < mapa.length; i++) {
            for (int j = 0; j < mapa[i].length; j++) {
                mapa[i][j] = ' ';
            }
        }
    }

    public void desenha(int jogada) {
        System.out.println("------------- .. jogada: " + jogada);
        for (int i = 0; i < mapa.length; i++) {
            System.out.print("|");
            for (int j = 0; j < mapa[i].length; j++) {
                System.out.print(" " + mapa[i][j] + " |");
            }
            System.out.println();
            if (i < mapa.length - 1) {
                System.out.println("-------------");
            } else {
                System.out.println("----------------------------");
            }
        }
    }

    public boolean jogar(int l, int c, char jogador) {
        if (l >= 0 && l < mapa.length && c >= 0 && c < mapa[0].length && mapa[l][c] == ' ') {
            mapa[l][c] = jogador;
            return true;
        }
        return false;
    }

    public boolean ganhou(char jogador) {
        // Linhas e colunas
        for (int i = 0; i < 3; i++) {
            if ((mapa[i][0] == jogador && mapa[i][1] == jogador && mapa[i][2] == jogador) ||
                    (mapa[0][i] == jogador && mapa[1][i] == jogador && mapa[2][i] == jogador)) {
                return true;
            }
        }

        // Diagonais
        if ((mapa[0][0] == jogador && mapa[1][1] == jogador && mapa[2][2] == jogador) ||
                (mapa[0][2] == jogador && mapa[1][1] == jogador && mapa[2][0] == jogador)) {
            return true;
        }

        boolean empate = true;
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (mapa[i][j] == ' ') {
                    empate = false;
                    break;
                }
            }
        }

        if (empate) {
            System.out.println("... EMPATOU!");
        }

        return false;
    }
}