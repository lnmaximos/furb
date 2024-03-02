class JogoDaVelha_PC {
    private JogoDaVelha_Mapa mapa;
    private char letra;

    public JogoDaVelha_PC(JogoDaVelha_Mapa mapa) {
        this.mapa = mapa;
        letra = 'O';
    }

    public boolean joga() {
        int l, c;
        do {
            l = mapa.sortear(0, 2);
            c = mapa.sortear(0, 2);
        } while (!mapa.jogar(l, c, letra));

        System.out.println("PC" + "[" + l + "," + c + "]");

        if (mapa.ganhou(letra)) {
            System.out.println("... PC GANHOU!");
            return true;
        }
        return false;
    }
}