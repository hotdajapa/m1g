setcookie('paginaAtual','produto');
function toggleFullScreen(){
	document.requestFullscreen();
  }
//AVALIAÃ‡Ã•ES
function avaliação(id,fullid,ação){
	corForte = $('#corForte').text();
	corFraca = $('#corFraca').text();
	
	corLike = $('#corLike'+id).css('color');
	corUnlike = $('#corUnlike'+id).css('color');
	
	likes = $('#likes'+id).text();
	unlikes = $('#unlikes'+id).text();
	
	$.ajax({
		url: $('#caminhoBase').text()+'/api/',type: "POST",async: true,data: 'metodo=avaliação&id='+id+'&fullid='+fullid+'&ação='+ação+'&corForte='+corForte+'&corFraca='+corFraca+'&corLike='+corLike+'&corUnlike='+corUnlike+'&likes='+likes+'&unlikes='+unlikes,dataType: "html",
		success: function(resposta){ resposta = resposta.trim();	
			/* console.log(resposta); */
			resposta = resposta.split('|');
			$('#likes'+id).text(resposta[0]);
			$('#unlikes'+id).text(resposta[1]);
			
			$('.corLike'+id).css('color',resposta[2]);
			$('#corLike'+id).css('color',resposta[2]);
			$('#botaoLike'+id).css('border-color',resposta[2]);
			
			$('.corUnlike'+id).css('color',resposta[3]);
			$('#corUnlike'+id).css('color',resposta[3]);
			$('#botaoUnlike'+id).css('border-color',resposta[3]);

			}
		});
	return;
	}









function selecionarVariação(fullid, variação, atributo, nome, id) {
    let totalDeAtributosDaVariação = $('.totalDeAtributosDaVariação' + variação).text();
    for (let c = 0; c < totalDeAtributosDaVariação; c++) {
        if (parseInt(c) == parseInt(atributo)) {
            $('.variação' + variação + 'atributo' + atributo).css('border', 'solid 2px #3483fa');
        } else {
            $('.variação' + variação + 'atributo' + c).css('border', 'dashed 1px rgba(0,0,0,.25)');
        }
    }

    let textoDoAtributo = $('.textovariação' + variação + 'atributo' + atributo).text();
    $('.atributoDaVariação' + variação).text(textoDoAtributo);

    let imagemDoAtributo = $('.imagemvariação' + variação + 'atributo' + atributo).text();
    $('.imagemDaVariação' + variação).css('background-image', 'url("' + imagemDoAtributo + '")');

    let fullidAtributo = $('.fullidvariação' + variação + 'atributo' + atributo).text();

    // Atualização direta do carrinho
    let carrinho = JSON.parse(localStorage.getItem('produtos')) || [];
    console.log('Carrinho antes da atualização:', carrinho);

    let produto = carrinho.find(item => item.id === id);
    if (produto) {
        // Verifica se a propriedade 'variacoes' existe; caso contrário, inicializa como um array vazio
        if (!produto.variacoes) {
            produto.variacoes = [];
        }
//alert(nome);


        let variacaoExistente = produto.variacoes.find(v => v.nome === nome);
        if (variacaoExistente) {
            variacaoExistente.valor = textoDoAtributo;
        } else {
            produto.variacoes.push({
                nome: nome,
                valor: textoDoAtributo
            });
        }
    } else {
        alert('Produto não encontrado no carrinho.');
        return;
    }

    // Recalcula o valor total do carrinho
    let totalCarrinho = 0;
    let quantidadeTotalProdutos = 0;

    carrinho.forEach(item => {
        let itemValor = parseFloat(item.valor);
        let itemQuantidade = parseInt(item.quantidade, 10);
        if (!isNaN(itemValor) && !isNaN(itemQuantidade)) {
            totalCarrinho += itemValor * itemQuantidade;
            quantidadeTotalProdutos += itemQuantidade;
        }
    });

  //  carrinho.push({
  //      quantidadeprodutos: quantidadeTotalProdutos,
  //      total: totalCarrinho.toFixed(2)
  //  });

    localStorage.setItem('produtos', JSON.stringify(carrinho));
    console.log('Carrinho atualizado:', JSON.stringify(carrinho, null, 2));

    if (fullidAtributo.length == 9 && ir != 'não') {
        window.location.href = 'https://' + $('#dominio').text() + '/' + fullidAtributo;
    }

    return;
}





	
	
	
function selecionarQuantidade(quantidade, id) {
    

    // Se a quantidade for manual, obtém o valor do input e limpa o campo
    if (quantidade === 'manual') {
        quantidade = parseInt($('.quantidadePersonalizada').val(), 10);
        if (isNaN(quantidade) || quantidade <= 0) {
            alert('Quantidade inválida. Por favor, insira um valor válido.');
            return;
        }
        console.log('Quantidade manual:', quantidade);
        $('.quantidadeEscolhida').text(quantidade);
        modal("modalQuantidade");
        setTimeout(function() {
            quantidadeManual();
        }, 150);
        $('.quantidadePersonalizada').val('');
    } else {
        quantidade = parseInt(quantidade, 10);
        if (isNaN(quantidade) || quantidade <= 0) {
            alert('Quantidade inválida.');
            return;
        }
        console.log('Quantidade padrão:', quantidade);
        $('.quantidadeEscolhida').text(quantidade);
        modal("modalQuantidade");
    }

    // Verifica o carrinho no localStorage
    let carrinho = JSON.parse(localStorage.getItem('produtos')) || [];
    console.log('Carrinho antes da atualização:', carrinho);

    // Encontra o produto pelo ID
    let produto = carrinho.find(item => item.id === id);

    if (produto) {
        // Atualiza a quantidade do produto
        produto.quantidade = quantidade;
    } else {
        // Se o produto não existe, exibe uma mensagem de erro ou não faz nada
        alert('Produto não encontrado no carrinho.');
        return;
    }

    // Recalcula o valor total do carrinho
    let totalCarrinho = 0;
    let quantidadeTotalProdutos = 0;

    carrinho.forEach(item => {
        if (item.id) {  // Verifica se é um produto e não a entrada de total
            let itemValor = parseFloat(item.valor);
            let itemQuantidade = parseInt(item.quantidade, 10);

            // Verifica se o valor e a quantidade são números válidos
            if (!isNaN(itemValor) && !isNaN(itemQuantidade)) {
                totalCarrinho += itemValor * itemQuantidade;
                quantidadeTotalProdutos += itemQuantidade;
            } else {
                console.error(`Valores inválidos: valor=${itemValor}, quantidade=${itemQuantidade}`);
            }
        }
    });

    // Atualiza a entrada de total no carrinho
    let totalEntryIndex = carrinho.findIndex(item => item.quantidadeprodutos !== undefined);
    if (totalEntryIndex !== -1) {
        // Remove a entrada antiga de total
        carrinho.splice(totalEntryIndex, 1);
    }

    // Adiciona a nova entrada de total
    carrinho.push({
        quantidadeprodutos: quantidadeTotalProdutos,
        total: totalCarrinho.toFixed(2)
    });

    // Salva o carrinho atualizado no localStorage
    localStorage.setItem('produtos', JSON.stringify(carrinho));
    console.log('Carrinho atualizado:', JSON.stringify(carrinho, null, 2));
}

	
	
	
	
	
function quantidadeManual(){
	if($('.listaDeQuantidades').css('display')=='flex'){
		$('.listaDeQuantidades').hide();
		$('.quantidadeManual').fadeIn(150).css('display','flex');
		}else{
			$('.listaDeQuantidades').fadeIn(150).css('display','flex');
			$('.quantidadeManual').hide();
			}
	return;
	}
function perguntasDoProduto(){
	$.ajax({
		url: $('#caminhoBase').text()+'/api/',type: 'POST',async: true, data: 'metodo=perguntasDoProduto',dataType: 'html', 
			success: function(resposta){ 
				$('#perguntasDoProduto').html(resposta); 
			}
		});
	return;
	}
function perguntar(){
	pergunta = outputFilter($('#pergunta').val());
	if(pergunta.length==0){return;}
	loading('loading2');
	$.ajax({
		url: $('#caminhoBase').text()+'/api/',type: 'POST',async: true, data: 'metodo=perguntar&pergunta='+pergunta,dataType: 'html', 
			success: function(resposta){ 
				$('#perguntaFeita').fadeIn(150).css('display','flex');
				perguntasDoProduto();
				$('#pergunta').val('');
				setTimeout(function(){
					loading('loading2');
					setTimeout(function(){
						$('#perguntaFeita').fadeOut(150);
						},4000);
					},1000);
				
			}
		});
	return;
	}	
function comoPerguntar(){
	$('#pergunta').focus();
	return;
	}
function fecharPerguntaFeita(){
	$('#perguntaFeita').fadeOut(150);
	return;
	}
	
	
	
	



jQuery(document).ready(function($){

	$("#imagens-do-produto").owlCarousel({
		navigation : true,
		slideSpeed : 300,
		paginationSpeed : 400,
		singleItem:true,
		items : 1});


	$('.quantidadePersonalizada').keyup(function(){
		q = $('.quantidadePersonalizada').val();
		qt = $('#quantidadeTotal').text();
		if(parseInt(q)>parseInt(qt)){
			$('.quantidadePersonalizada').val(qt);
			}
		});
	});