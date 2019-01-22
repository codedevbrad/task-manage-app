# task-manage-app
task manage app for developers .


each stack in stacks
  - var str = stack.stackName.toUpperCase()

  div.stack(class='color-'+stack.color)
    div.stack-position
      a(href='/0/workspace/stack/'+stack._id).stack-inner-center
        h2=str.charAt(0)
        h3=stack.stackName
