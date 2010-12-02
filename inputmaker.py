#!/usr/bin/python
# -*- coding: utf-8 -*-
import sys
import re

naoTemFilho = 0
temUmFilho = 1
temMaisFilho = 2

def imprime(final, rec):
    for filho in final[1]:
        print "  "*rec, filho, '(', str(final[1][filho][0]), ')'
        imprime(final[1][filho], rec + 1)
                            
def fazJsonArvore(final, rec):
    for filho in final[1]:
        sys.stdout.write('  '*rec + '{ "key": "' + filho + '", "num": ' + str(final[1][filho][0]) + ', "filho": [')
        fazJsonArvore(final[1][filho], rec + 1)
        sys.stdout.write('  '*rec + ']},')
    if len(final[1]) == 0:
		sys.stdout.write(']')
    sys.stdout.write('\b')

def fazArvoreBruta(frases):
    final = [0, dict()]
    # insere cada frase na árvore final
    for frase in frases:
        temp = final[1]
        # tenta inserir cada palavra
        for palavra in frase.split(' '):
            if palavra not in temp:
                temp[palavra] = [1, dict()]
            else:
                temp[palavra][0] += 1
            temp = temp[palavra][1]
    return final

def arvoreSemLista(final):
    # se nodo é cabeça, chama para filho
    if final[0] == 0:
        for filho in final[1]:
            vez = arvoreSemLista(final[1][filho])
            final[1][filho] = vez[1]
            return final

    # se um nodo não tem filho, retorna frase vazia
    elif len(final[1]) == 0:
        return ["", final]

    # se um nodo só tem um filho
    elif len(final[1]) == 1:
        # faz chamada recursiva para filho
        for filho in final[1]:
            vez = arvoreSemLista(final[1][filho])
        # apaga filho e cria entrada com chave grande
        del final[1][filho]
        final[1][" " + filho + " " + vez[0]] = vez[1]
        return [" " + filho + " " + vez[0], vez[1]]
        
    else:
        # chama recursivamente para cada filho
        for filho in final[1]:
            vez = arvoreSemLista(final[1][filho])
            # se filho só tinha um filho, junta
            if len(final[1][filho][1]) == 1:
                del final[1][filho]
                final[1][" " + filho + " " + vez[0]] = vez[1]
        # retorna subarvore
        return ["", final]

def frasesPalavraInicial(raw, palavra):
    # TODO: fazer a palavra ser regex e depois uniformizar nas strings
    regexp = "\.[\s]+" + palavra + "[^\.]*"
    raw = "." + raw # gambs para regex sempre funcionar
    raw.replace('"', ' ')
    return re.findall(regexp, raw)

'''    
# Teste
teste = ['meu nome é antedeiguemon',
         'meu nome é pedro',
         'meu nome era joão',
         'meu carro é azul',
         'meu carro é laranja',
         'meu carro já foi laranja ou verde',
         'meu dedão está vermelho',
         'meu dedão arde mas eu não me importo com isso',
         'meu carro já era manolo',
         'meu irmão brilha muito no corinthians',
         'meu time joga 10'
         ]
teste = [
        'Dilma Rousseff nas pesquisas de intenção de voto já provocou uma reação do PSDB',
        'Dilma Rousseff, pré-candidata do PT à Presidência',
        'Dilma Rousseff, está em campanha há quase dois anos e já aparece nas pesquisas a apenas 4 pontos do governador',
        'Dilma preocupada com viés estatizante do programa de governo',
        'Dilma como uma guinada à esquerda, com caráter estatizante',
        'Dilma inaugura hospital no Rio',
        'Dilma à frente nas pesquisas'
        ]
'''

# lembrar de retirar aspas das coisas
entrada = open(sys.argv[1])
linhas = entrada.readlines()
entrada.close()

inicial = sys.argv[2]
frases = [frasesPalavraInicial(i, inicial) for i in linhas]
text = []
for frase in teste:
    if len(frase) > 0:
    	text.append(frase[0][2:].replace('"', "`"))

print text
arv = fazArvoreBruta(text)
arv = arvoreSemLista(arv)

#print final
#imprime(final,0)
fazJsonArvore(arv,0)
print
