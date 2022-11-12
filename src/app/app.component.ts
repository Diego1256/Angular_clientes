import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
 
  //atributos
  clientes: any[] = []; //ARRAY JSON
  paginador: number = 1; //controlar a paginação do grid
  filtro: any = { nome: '' }; //filtrar clientes pelo nome
  mensagemCadastro: string = ''; //mensagens da modal de cadastro
  mensagemEdicao: string = ''; //mensagens da modal de edição
 
  //construtor
  constructor(
    //inicializando o componente HttpClient
    private httpClient: HttpClient
  ) {
 
  }
 
  //método executado quando a página é aberta
  ngOnInit(): void {
    //executando o serviço de consulta da API
    this.httpClient.get(environment.apiClientes)
      .subscribe({
        next: (dados) => { //capturando a resposta de sucesso da API
          //armazenando os dados obtidos da API
          this.clientes = dados as any[];
        },
        error: (e) => { //capturando a resposta de erro da API
          console.log(e);
        }
      });
  }
 
  //formulário de cadastro de clientes
  formCadastro = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(8)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    cpf: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)])
  });
 
  //formulário para edição de clientes
  formEdicao = new FormGroup({
    idCliente: new FormControl('', [Validators.required]),
    nome: new FormControl('', [Validators.required, Validators.minLength(8)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    cpf: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)])
  });
 
  //função para exibir na página as mensagens de erro de validação
  //dos campos do formulário
  get cadastro(): any {
    return this.formCadastro.controls;
  }
 
  //função para exibir na página as mensagens de erro de validação
  //dos campos do formulário
  get edicao(): any {
    return this.formEdicao.controls;
  }
 
  //função para capturar o SUBMIT do formulário
  //e enviar os dados para a API (POST)
  onSubmit(): void {
 
    //limpar a mensagem
    this.mensagemCadastro = '';
 
    //fazer uma requisição POST para o ENDPOINT da API
    this.httpClient.post(environment.apiClientes, this.formCadastro.value)
      .subscribe({
        next: (dados: any) => { //capturando resposta de sucesso
          this.mensagemCadastro = dados.mensagem;
          this.formCadastro.reset(); //limpar o formulário
          this.ngOnInit(); //executando o método de consulta
        },
        error: (e) => { //capturando resposta de erro
          console.log(e);
        }
      });
  }
 
  //função para realizar a exclusão de um cliente na API
  onDelete(idCliente: number): void {
 
    //solicitar que o usuário confirme a operação
    if (window.confirm('Deseja realmente excluir o cliente?')) {
 
      //fazendo uma requisição de exclusão para a API
      this.httpClient.delete(environment.apiClientes + '/' + idCliente)
        .subscribe({
          next: (dados: any) => {
            alert(dados.mensagem); //popup com a mensagem
            this.ngOnInit(); //executando uma nova consulta na API
          },
          error: (e) => {
            console.log(e);
          }
        })
    }
  }
 
  //função para obter os dados de 1 cliente
  //baseado no ID
  getCliente(idCliente: number): void {
 
    //requisição para o serviço de consulta de cliente por id
    this.httpClient.get(environment.apiClientes + "/" + idCliente)
      .subscribe({
        next: (data: any) => { //capturando a resposta de sucesso
          //preenchendo o formulário com os dados obtidos da API
          this.formEdicao.patchValue(data);
        },
        error: (e) => { //capturando a resposta de erro
          console.log(e);
        }
      });
  }
 
  //função para capturar o SUBMIT do formulário
  //e enviar os dados para a API (PUT)
  onUpdate(): void {
 
    //limpar a mensagem
    this.mensagemEdicao = '';
 
    //fazer uma requisição PUT para a API
    this.httpClient.put(environment.apiClientes, this.formEdicao.value)
      .subscribe({
        next: (data: any) => {
          this.mensagemEdicao = data.mensagem;
          this.ngOnInit(); //executando uma nova consulta na API
        },
        error: (e) => {
          console.log(e);
        }
      })
  }
 
  //função para que o componente de paginação
  //possa avançar e voltar entre as páginas
  handlePageChange(event: any): void {
    this.paginador = event;
  }
 
}