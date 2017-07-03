import Vue from 'vue';

<template>
  <div class="main">
    <h1>Welcome to Storybook for Vue</h1>
    <p>
      This is a UI component dev environment for your vue app.
    </p>
    
    <p style="text-align:center"><img src="./images/logo.png" /></p>
  </div>
</template>

<style>
  .main {
    margin: 15px;
    max-width: 600;
    line-height: 1.4;
    font-family: "Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif;
  }

  .logo {
    width: 200;
  }

  .link {
    color: #1474f3;
    text-decoration: none;
    border-bottom: 1px solid #1474f3;
    padding-bottom: 2px;
  }

  .code {
    font-size: 15;
    font-weight: 600;
    padding: 2px 5px;
    border: 1px solid #eae9e9;
    border-radius: 4px;
    background-color: #f3f2f2;
    color: #3a3a3a;
  }

  .codeBlock {
    background-color: #f3f2f2;
    padding: 1px 10px;
    margin: 10px 0;
  }

  .note {
    opacity: 0.5;
  }
</style>
