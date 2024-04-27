# Ceneco Advisory Checker
Github action that checks if your place is in the latest [Ceneco Power Advisory](https://www.ceneco.ph/advisory)

**Example**: [Action](https://github.com/AlecBlance/CenecoAdvisoryChecker/actions)

### Usage
```yaml
- name: Check Advisory
  usage: AlecBlance/CenecoAdvisoryChecker@v1.0.0
  with: 
    place: ${{ secrets.PLACE }}
```
### Input
| Name        | Type    | Description                                    |
| ----------- | ------- | ---------------------------------------------- |
| place       | string  | Your place                                     |

### Outputs
| Name        | Type    | Description                                    |
| ----------- | ------- | ---------------------------------------------- |
| isSendEmail | boolean | Identifier to send an email                    |
| advisoryUrl | string  | The url of the advisory your place is included |
